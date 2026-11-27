"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export default function HeroSearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed
        ? `/browse-tuitions?search=${encodeURIComponent(trimmed)}`
        : "/browse-tuitions"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Math, Physics, IELTS, React..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700 cursor-pointer"
      >
        <span>Browse Tuitions</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}