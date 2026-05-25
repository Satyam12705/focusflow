import { useEffect, useState } from "react";

const QUOTES = [
  "Small steps every day.",
  "Discipline is choosing what you want most over what you want now.",
  "Focus on progress, not perfection.",
  "You don't have to be great to start, but you have to start to be great.",
  "Done is better than perfect.",
  "Your future is created by what you do today.",
  "Study smarter, not harder.",
  "One task at a time. One win at a time.",
];

export function quoteOfTheDay() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return QUOTES[day % QUOTES.length];
}

/** Client-only formatted date — avoids SSR/locale hydration mismatch. */
export function useTodayString() {
  const [s, setS] = useState("");
  useEffect(() => {
    setS(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);
  return s;
}
