import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { MODELS } from "@/lib/stego/models";

export const Route = createFileRoute("/models")({ component: ModelsPage });

function ModelsPage() {
  return (
    <AppShell>
      <PageHeader kicker="Module 05" title="Models" />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Five paper methods plus ARES-Hybrid-INN. Original deep weights from the papers were not
        released; those five run as the same reproductions used in the ARES research repo.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {MODELS.map((m) => (
          <article key={m.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl">{m.name}</h2>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {m.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{m.paper}</p>
            <p className="mt-3 text-sm leading-relaxed text-fg">{m.note}</p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              method={m.methodKey}
              {m.usesHamming ? " · Hamming(7,3)" : " · LSB"}
              {m.usesAdaptive ? " · adaptive" : ""}
              {m.usesCompensate ? " · residual" : ""}
            </p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
