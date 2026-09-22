#!/usr/bin/env python3
"""ARES-Upgraded entry point."""
import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def cmd_benchmark(args):
    from benchmark.runner import run_benchmark
    from PIL import Image
    images = None
    if args.images:
        images = [Image.open(p).convert("RGB") for p in args.images]
    result = run_benchmark(images=images, secret=args.secret)
    print("Done. Results at:", result["out_dir"])
    summary = result["summary"]
    print("Best measured model:", summary.get("best_measured_model"))
    print("Score:", summary.get("best_score"))


def cmd_list_models(args):
    from benchmark.registry import load_registry
    for m in load_registry()["models"]:
        print(f"{m['id']:20s}  {m['name']:40s}  status={m['status']}")


def cmd_ui(args):
    from app.ui_dashboard import build_ui
    demo = build_ui()
    demo.launch(server_name="0.0.0.0", server_port=args.port, share=False)


def main():
    p = argparse.ArgumentParser(description="ARES-Upgraded")
    sub = p.add_subparsers(dest="cmd")

    b = sub.add_parser("benchmark", help="Run full 5-image x 6-model benchmark")
    b.add_argument("--images", nargs="*")
    b.add_argument("--secret", default=None)
    b.set_defaults(func=cmd_benchmark)

    l = sub.add_parser("list-models")
    l.set_defaults(func=cmd_list_models)

    u = sub.add_parser("ui", help="Launch Gradio research dashboard")
    u.add_argument("--port", type=int, default=7860)
    u.set_defaults(func=cmd_ui)

    args = p.parse_args()
    if not args.cmd:
        cmd_benchmark(argparse.Namespace(images=None, secret=None))
        return
    args.func(args)


if __name__ == "__main__":
    main()
