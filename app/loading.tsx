import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] bg-white px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        {/* Page Header Skeleton */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2.5">
            <div className="h-4 w-28 rounded-full bg-blue-100 dark:bg-blue-950/60" />
            <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-80 max-w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
          </div>

          <div className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Filter / Search Bar Skeleton */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="h-10 rounded-xl bg-slate-200/80 sm:col-span-2 dark:bg-slate-800" />
          <div className="h-10 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
          <div className="h-10 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
        </div>

        {/* Tuition Cards Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              {/* Banner Image Placeholder */}
              <div className="h-44 w-full bg-slate-200/80 dark:bg-slate-800" />

              {/* Card Body */}
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 rounded-md bg-blue-100/80 dark:bg-blue-950/60" />
                  <div className="h-5 w-24 rounded-md bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="space-y-2">
                  <div className="h-5 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-1/2 rounded-lg bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="h-5 w-24 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}