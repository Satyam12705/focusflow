import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { Spinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocalCollection, uid, type Note } from "@/lib/storage";
import { Pencil, Plus, StickyNote, Trash2, Check, X } from "lucide-react";

export const Route = createFileRoute("/notes")({
  component: () => (
    <AppShell>
      <NotesPage />
    </AppShell>
  ),
});

function NotesPage() {
  const { items: notes, setItems, loading } = useLocalCollection<Note>("focusflow.notes");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  function addNote() {
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [{ id: uid(), text, updatedAt: Date.now() }, ...prev]);
    setDraft("");
    toast.success("Note saved");
  }

  function startEdit(n: Note) {
    setEditingId(n.id);
    setEditingText(n.text);
  }

  function saveEdit() {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((n) =>
        n.id === editingId ? { ...n, text: editingText.trim(), updatedAt: Date.now() } : n,
      ),
    );
    setEditingId(null);
    toast.success("Note updated");
  }

  const remove = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast("Note deleted");
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
        <h2 className="mt-2 font-display text-5xl leading-[0.95] tracking-tight">
          Quick <span className="italic">notes</span>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md">
          Capture ideas, reminders, and study snippets in seconds.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a quick note…"
          rows={3}
          className="border-0 bg-secondary/60 focus-visible:bg-secondary resize-none"
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={addNote}>
            <Plus className="h-4 w-4" /> Add note
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading notes…" />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="h-6 w-6" />}
          title="No notes yet"
          description="Your saved notes will appear here as cards."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n, i) => (
            <div
              key={n.id}
              className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
            >
              {editingId === n.id ? (
                <>
                  <Textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={4}
                    className="border-0 bg-secondary/60 focus-visible:bg-secondary resize-none"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                    <Button size="sm" onClick={saveEdit}>
                      <Check className="h-4 w-4" /> Save
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      Note {String(notes.length - i).padStart(2, "0")}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(n)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(n.id)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{n.text}</p>
                  <p className="mt-4 text-xs text-muted-foreground" suppressHydrationWarning>
                    {new Date(n.updatedAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
