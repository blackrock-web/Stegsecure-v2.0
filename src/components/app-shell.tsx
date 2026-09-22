import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Binary, FileSearch, LayoutGrid, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Encoder", icon: LockKeyhole },
  { to: "/decoder", label: "Decoder", icon: FileSearch },
  { to: "/benchmark", label: "Benchmark", icon: LayoutGrid },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/models", label: "Models", icon: Binary },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh max-w-[1400px]">
        <aside className="sticky top-0 flex h-dvh w-[220px] shrink-0 flex-col border-r border-border bg-sidebar max-md:hidden">
          <div className="px-5 pb-6 pt-7">
            <p className="font-display text-xl leading-tight text-ink">ARES</p>
            <p className="mt-1 text-xs text-muted-foreground">Stego Lab</p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-3">
            {NAV.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-[var(--motion-quick)]",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-fg",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="px-5 py-5 text-[11px] leading-relaxed text-muted-foreground">
            Light workbench. Measured metrics only. Paper nets without public weights are labeled
            reproductions.
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="flex gap-1 overflow-x-auto border-b border-border bg-sidebar px-2 py-2 md:hidden">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "h-10 shrink-0 rounded-md px-3 text-sm leading-10",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <main className="flex-1 px-4 py-6 md:px-10 md:py-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, kicker }: { title: string; kicker: string }) {
  return (
    <header className="mb-8">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {kicker}
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink md:text-4xl">{title}</h1>
    </header>
  );
}
