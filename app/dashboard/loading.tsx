import React from "react";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6">
      {/* Header & Action Button Skeleton */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="h-7 w-52 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-80 max-w-full rounded-lg bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 4 KPI Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-slate-200/80 dark:bg-slate-800" />
              <div className="h-9 w-9 rounded-xl bg-blue-100/70 dark:bg-blue-950/50" />
            </div>
            <div className="mt-4 h-7 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/70" />
          </div>
        ))}
      </div>

      {/* Data Table / Activity Panel Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Table Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-48 rounded-xl bg-slate-100 dark:bg-slate-800/70" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>

              <div className="hidden h-4 w-24 rounded bg-slate-100 sm:block dark:bg-slate-800" />
              <div className="h-6 w-20 rounded-full bg-slate-200/80 dark:bg-slate-800" />
              <div className="h-8 w-24 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}