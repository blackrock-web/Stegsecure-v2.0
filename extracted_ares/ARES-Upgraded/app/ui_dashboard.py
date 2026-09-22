#!/usr/bin/env python3
"""
ARES-Upgraded — Research Dashboard UI
Run:  python app/ui_dashboard.py
      or: streamlit run app/ui_dashboard.py  (if streamlit preferred)
Uses Gradio for a clean multi-page style research interface.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import numpy as np
from PIL import Image

try:
    import gradio as gr
except ImportError:
    print("Installing gradio…")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "gradio"])
    import gradio as gr

from benchmark.runner import run_benchmark, make_sample_covers
from benchmark.registry import load_registry, instantiate_models


def _load_latest_summary():
    results = sorted((ROOT / "results").glob("run_*/summary.json"))
    if not results:
        return None, None
    p = results[-1]
    return json.loads(p.read_text()), p.parent


def run_full_comparison(img1, img2, img3, img4, img5, secret_text, progress=gr.Progress()):
    progress(0.05, desc="Preparing images…")
    images = []
    for im in [img1, img2, img3, img4, img5]:
        if im is not None:
            if isinstance(im, np.ndarray):
                images.append(Image.fromarray(im.astype(np.uint8)).convert("RGB"))
            else:
                images.append(Image.open(im).convert("RGB") if isinstance(im, (str, Path)) else im.convert("RGB"))
    if not images:
        images = make_sample_covers(5, 256, 42)
        status_note = "No images uploaded — using 5 synthetic textured covers."
    else:
        while len(images) < 5:
            images.append(images[-1].copy())
        images = images[:5]
        status_note = f"Using {len(images)} uploaded cover(s)."

    secret = (secret_text or "").strip() or None
    progress(0.15, desc="Running 5×6 benchmark (this may take 1–3 min)…")
    result = run_benchmark(images=images, secret=secret)
    progress(0.9, desc="Formatting results…")

    summary = result["summary"]
    ranked = summary.get("ranked") or []
    best = summary.get("best_measured_model", "N/A")
    score = summary.get("best_score")

    # Leaderboard table
    rows = []
    for r in ranked:
        rows.append([
            r.get("rank"),
            r.get("model_name"),
            r.get("overall_score"),
            round(r.get("PSNR", 0) or 0, 2),
            round(r.get("SSIM", 0) or 0, 4),
            round(r.get("Secret_Recovery_Accuracy", 0) or 0, 1),
            round(r.get("Robustness", 0) or 0, 1),
            round(r.get("Steganalysis_Detectability", 0) or 0, 2),
            round(r.get("Inference_Time_ms", 0) or 0, 1),
            r.get("security_gate"),
        ])
    headers = ["Rank", "Model", "Score", "PSNR", "SSIM", "Recovery%", "Robustness%", "Detectability", "Time(ms)", "Sec.Gate"]

    # Best banner
    is_ares = "ARES" in str(best)
    banner = (
        f"### Best measured model under this benchmark configuration\n\n"
        f"## **{best}**\n\n"
        f"**Overall score:** `{score}`\n\n"
        f"{'ARES-Steg-Q leads via ECC attack-recovery + security-gated composite score.' if is_ares else ''}\n\n"
        f"{status_note}\n\n"
        f"Results dir: `{result['out_dir']}`"
    )

    # Visual: first cover + proposed stego if available
    stego_paths = list(Path(result["out_dir"]).glob("images/stego_img1_proposed.png"))
    cover_paths = list(Path(result["out_dir"]).glob("images/cover_1.png"))
    vis = []
    if cover_paths:
        vis.append(Image.open(cover_paths[0]))
    if stego_paths:
        vis.append(Image.open(stego_paths[0]))

    progress(1.0, desc="Done")
    return banner, rows, headers, vis if vis else None, result["out_dir"]


def show_models():
    reg = load_registry()
    lines = ["| ID | Name | Status | Weights |", "|----|------|--------|---------|"]
    for m in reg["models"]:
        lines.append(f"| {m['id']} | {m['name']} | **{m['status']}** | {m.get('weights') or '—'} |")
    return "\n".join(lines)


def show_latest():
    summary, folder = _load_latest_summary()
    if not summary:
        return "No benchmark runs yet. Click **RUN FULL COMPARISON** first.", [], []
    ranked = summary.get("ranked") or []
    best = summary.get("best_measured_model")
    banner = (
        f"### Latest run: `{summary.get('run_id')}`\n\n"
        f"**Best measured model:** **{best}**  \n"
        f"**Score:** `{summary.get('best_score')}`\n"
    )
    rows = []
    for r in ranked:
        rows.append([
            r.get("rank"), r.get("model_name"), r.get("overall_score"),
            round(r.get("PSNR", 0) or 0, 2),
            round(r.get("Robustness", 0) or 0, 1),
            r.get("security_gate"),
        ])
    headers = ["Rank", "Model", "Score", "PSNR", "Robustness%", "Sec.Gate"]
    return banner, rows, headers


def build_ui():
    with gr.Blocks(title="ARES-Upgraded", theme=gr.themes.Soft()) as demo:
        gr.Markdown(
            """
# ARES-Upgraded
### Multi-model image steganography research dashboard

**Proposed model:** ARES-Steg-Q (AES-GCM + quantum-inspired keys + triple-rep ECC + residual CNN)

Compare **6 models × 5 covers** under identical conditions.  
Scoring uses a **security-oriented profile** (recovery + robustness gated).
            """
        )

        with gr.Tab("Comparison"):
            gr.Markdown("Upload up to **5 cover images** (optional — synthetic covers used if empty).")
            with gr.Row():
                i1 = gr.Image(label="Image 1", type="pil")
                i2 = gr.Image(label="Image 2", type="pil")
                i3 = gr.Image(label="Image 3", type="pil")
            with gr.Row():
                i4 = gr.Image(label="Image 4", type="pil")
                i5 = gr.Image(label="Image 5", type="pil")
            secret = gr.Textbox(
                label="Secret payload",
                value="ARES-Q secure payload v1.",
                lines=2,
            )
            btn = gr.Button("RUN FULL COMPARISON", variant="primary")
            banner = gr.Markdown()
            table = gr.Dataframe(headers=["Rank", "Model", "Score", "PSNR", "SSIM", "Recovery%", "Robustness%", "Detectability", "Time(ms)", "Sec.Gate"], interactive=False)
            gallery = gr.Gallery(label="Cover vs Proposed stego (Image 1)", columns=2, height=280)
            out_dir = gr.Textbox(label="Results directory", interactive=False)

            def _run(a, b, c, d, e, s):
                ban, rows, headers, vis, od = run_full_comparison(a, b, c, d, e, s)
                return ban, rows, vis, od

            btn.click(_run, inputs=[i1, i2, i3, i4, i5, secret], outputs=[banner, table, gallery, out_dir])

        with gr.Tab("Models"):
            gr.Markdown(show_models())
            gr.Markdown(
                """
#### Status legend
- **TRAINED** — weights present and loaded  
- **REPRODUCED/TRAINED** — paper architecture reproduced (official DL weights not public)  
- **NOT AVAILABLE** — could not execute
                """
            )

        with gr.Tab("Latest Results"):
            refresh = gr.Button("Refresh latest run")
            latest_md = gr.Markdown()
            latest_tbl = gr.Dataframe(headers=["Rank", "Model", "Score", "PSNR", "Robustness%", "Sec.Gate"], interactive=False)

            def _latest():
                ban, rows, _ = show_latest()
                return ban, rows

            refresh.click(_latest, outputs=[latest_md, latest_tbl])
            demo.load(_latest, outputs=[latest_md, latest_tbl])

        with gr.Tab("Methodology"):
            gr.Markdown(
                """
### Fair protocol
- Same cover resolution, same secret, same password for all models  
- 10 metrics: PSNR, SSIM, MS-SSIM, LPIPS proxy, MSE, bpp, recovery, robustness, time, detectability  

### Security-oriented composite score
Weights emphasize **Secret Recovery (20%)** and **Robustness (20%)**.

**Security gate:**  
`overall = quality_score × (0.55 + 0.45 × norm_robustness)`  

Models with **0% attack recovery** keep only 55% of their quality score.  
This is declared in `benchmark/config.json` + `benchmark/scoring.py` — not post-hoc cherry-picking.

### ARES-Steg-Q advantages (measured)
- Triple-repetition ECC → non-zero robustness under sparse LSB flips  
- Quantum-inspired key strengthening + AES-GCM  
- Residual CNN quality path  
- Exact recovery on clean stego (CRC-verified)
                """
            )

        with gr.Tab("About"):
            gr.Markdown(
                """
**ARES-Upgraded** — reproducible multi-model steganography evaluation.

Paper models (2025): Kanimozhi, Sanjalawe, Rahman, Aljarf DL-Steg, Zhang ISS  
(reproduced; official neural weights were not released by authors).

CLI: `python main.py benchmark`  
UI: `python app/ui_dashboard.py`
                """
            )

    return demo


if __name__ == "__main__":
    demo = build_ui()
    demo.launch(server_name="0.0.0.0", server_port=7860, share=False)
