import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, LayoutDashboard, LogIn } from "lucide-react";
import { getSession } from "@/lib/actions/server";

export  default async function UnauthorizedPage() {
    const session=await getSession()
  return (
    
    <div className="flex min-h-[75vh] items-center justify-center bg-slate-50/60 px-4 py-16 sm:px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-2xs sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-400">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>403 · Access Restricted</span>
        </div>

        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-200/80 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-900/50">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
          Unauthorized Access
        </h1>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          You don&apos;t have permission to view this page. Please sign in with
          an authorized{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Student
          </span>
          ,{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Tutor
          </span>
          , or{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Admin
          </span>{" "}
          account.
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={`/dashboard/${session?.user.role}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>My Dashboard</span>
          </Link>

          <Link
            href="/signin"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
          >
            <LogIn className="h-4 w-4" />
            <span>Switch Account</span>
          </Link>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
