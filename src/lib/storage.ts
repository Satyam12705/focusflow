// Tiny localStorage-backed store. Swap with fetch() calls to the Express backend in /backend.
import { useEffect, useState } from "react";

export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  text: string;
  updatedAt: number;
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalCollection<T>(key: string, initial: T[] = []) {
  const [items, setItems] = useState<T[]>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a tiny async load so spinner shows briefly.
    const t = setTimeout(() => {
      setItems(load<T[]>(key, initial));
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, key, loading]);

  return { items, setItems, loading };
}

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
