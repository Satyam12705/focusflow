import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { Spinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalCollection, uid, type Task, type Priority } from "@/lib/storage";
import { CheckSquare, Plus, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  component: () => (
    <AppShell>
      <TasksPage />
    </AppShell>
  ),
});

const PRIORITY_DOT: Record<Priority, string> = {
  High: "bg-[oklch(0.6_0.16_28)]",
  Medium: "bg-[oklch(0.7_0.12_70)]",
  Low: "bg-[oklch(0.65_0.08_140)]",
};

type Filter = "all" | "pending" | "completed";

function TasksPage() {
  const { items: tasks, setItems, loading } = useLocalCollection<Task>("focusflow.tasks");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return tasks
      .filter((t) =>
        filter === "all" ? true : filter === "completed" ? t.completed : !t.completed,
      )
      .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, filter, query]);

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    setItems((prev) => [
      { id: uid(), title: text, priority, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setTitle("");
    toast.success("Task added");
  }

  const toggle = (id: string) =>
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const remove = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    toast("Task deleted");
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
        <h2 className="mt-2 font-display text-5xl leading-[0.95] tracking-tight">
          Your <span className="italic">tasks</span>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md">
          Add what's on your mind. Mark it done when it's done.
        </p>
      </header>

      <form
        onSubmit={addTask}
        className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-3"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          className="flex-1 border-0 bg-secondary/60 focus-visible:bg-secondary"
        />
        <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
          <SelectTrigger className="sm:w-36 bg-secondary/60 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="sm:w-32">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="pl-9 border-0 bg-card"
          />
        </div>
        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {(["all", "pending", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-full capitalize transition-colors",
                filter === f
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading tasks…" />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-6 w-6" />}
          title={tasks.length === 0 ? "No tasks yet" : "Nothing matches"}
          description={
            tasks.length === 0
              ? "Add your first task above to get started."
              : "Try clearing the search or switching filter."
          }
        />
      ) : (
        <ul className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {visible.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40"
            >
              <Checkbox checked={t.completed} onCheckedChange={() => toggle(t.id)} />
              <span className={cn("h-2 w-2 rounded-full shrink-0", PRIORITY_DOT[t.priority])} />
              <span
                className={cn(
                  "flex-1 text-sm",
                  t.completed && "line-through text-muted-foreground",
                )}
              >
                {t.title}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {t.priority}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(t.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
