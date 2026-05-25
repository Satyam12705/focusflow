import { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/tasks", label: "Tasks" },
  { to: "/notes", label: "Notes" },
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1400px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 border-b md:border-b-0 md:border-r border-border bg-sidebar">
          <div className="flex items-center justify-between md:block px-6 py-6">
            <Link to="/" className="block group">
              <h1 className="font-display text-3xl tracking-tight leading-none">
                Focus<span className="italic text-primary">flow</span>.
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Study companion
              </p>
            </Link>
          </div>

          <nav className="flex md:flex-col gap-1 px-3 pb-4 md:pb-6 overflow-x-auto">
            {NAV.map(({ to, label }) => {
              const active = to === "/" ? path === "/" : path.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      active ? "bg-primary" : "bg-border",
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block mt-auto px-6 py-6 text-[11px] text-muted-foreground">
            v1.0 — handcrafted
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-6 md:px-10 md:py-10">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
