import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import { Spinner } from "@/components/Spinner";
import { useTodayString, quoteOfTheDay } from "@/lib/quotes";
import { useLocalCollection, type Task, type Note } from "@/lib/storage";
import { ArrowUpRight, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const today = useTodayString();
  const { items: tasks, loading } = useLocalCollection<Task>("focusflow.tasks");
  const { items: notes } = useLocalCollection<Note>("focusflow.notes");

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground" suppressHydrationWarning>
            {today || "Today"}
          </p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl leading-[0.95] tracking-tight">
            Good to see you, <span className="italic">student</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            A small, calm overview of your day. No noise — just what matters.
          </p>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors"
        >
          New task <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      {loading ? (
        <Spinner label="Loading…" />
      ) : (
        <>
          {/* Bento grid */}
          <section className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(140px,auto)] gap-4">
            {/* Big: Total + progress */}
            <Card className="md:col-span-3 md:row-span-2 flex flex-col justify-between bg-gradient-to-br from-secondary/70 via-card to-card">
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Today's Progress
                </span>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-7xl leading-none">{completed}</span>
                  <span className="text-muted-foreground text-lg">/ {tasks.length || 0}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">tasks completed</p>
                <div className="mt-5 h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{progress}% of today's load</p>
              </div>
            </Card>

            {/* Pending */}
            <Card className="md:col-span-3">
              <Stat
                icon={<Clock className="h-4 w-4" />}
                label="Pending"
                value={pending}
                suffix="open"
              />
            </Card>

            {/* Completed */}
            <Card className="md:col-span-3">
              <Stat
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Completed"
                value={completed}
                suffix="done"
              />
            </Card>

            {/* Quote — wide */}
            <Card className="md:col-span-4 bg-foreground text-background">
              <span className="text-xs uppercase tracking-[0.2em] text-background/60">
                Quote of the day
              </span>
              <p className="mt-3 font-display text-2xl md:text-3xl leading-snug italic">
                "{quoteOfTheDay()}"
              </p>
            </Card>

            {/* Notes count */}
            <Card className="md:col-span-2 flex flex-col justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Notes
              </span>
              <div>
                <div className="font-display text-5xl leading-none">{notes.length}</div>
                <Link
                  to="/notes"
                  className="mt-3 inline-flex items-center gap-1 text-sm hover:underline underline-offset-4"
                >
                  Open notes <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>

            {/* Recent tasks list */}
            <RecentCard
              className="md:col-span-3"
              title="Recent tasks"
              empty="No tasks yet."
              href="/tasks"
              items={tasks
                .slice()
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 4)
                .map((t) => ({
                  id: t.id,
                  primary: t.title,
                  secondary: t.completed ? "Done" : t.priority,
                  dim: t.completed,
                }))}
            />

            {/* Recent notes */}
            <RecentCard
              className="md:col-span-3"
              title="Recent notes"
              empty="No notes yet."
              href="/notes"
              items={notes
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .slice(0, 4)
                .map((n) => ({
                  id: n.id,
                  primary: n.text.slice(0, 70) || "(empty)",
                  secondary: "",
                }))}
            />
          </section>
        </>
      )}
    </div>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-5xl leading-none">{value}</span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function RecentCard({
  title,
  items,
  empty,
  href,
  className,
}: {
  title: string;
  items: { id: string; primary: string; secondary: string; dim?: boolean }[];
  empty: string;
  href: "/tasks" | "/notes";
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">{title}</h3>
        <Link
          to={href}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className={cn("truncate pr-3", i.dim && "text-muted-foreground line-through")}>
                {i.primary}
              </span>
              {i.secondary && (
                <span className="shrink-0 text-xs text-muted-foreground">{i.secondary}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
