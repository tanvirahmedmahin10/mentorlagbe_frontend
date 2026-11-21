import React from "react";
import Link from "next/link";
import { BookOpen, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-slate-50/60 px-4 py-16 sm:px-6 dark:bg-slate-950">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span>404 · Page Not Found</span>
        </div>

        <h1 className="mt-6 text-6xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
          404
        </h1>

        <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          Oops! This page doesn&apos;t exist
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          The tuition batch or page you&apos;re looking for may have been
          moved, removed, or the link might be incorrect.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/browse-tuitions"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            <span>Browse Tuitions</span>
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}