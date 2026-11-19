import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import {
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { FetchStudentData } from "@/lib/getApiBackend/getData";
import { TuitionApplicationPayload } from "@/lib/types/type";

export default async function StudentPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as
    | { id: string; name?: string; email?: string; plan?: string }
    | undefined;

  const applications: TuitionApplicationPayload[] =
    (await FetchStudentData(user?.id, "applications")) ?? [];

  const totalApplied = applications.length;
  const acceptedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "accepted"
  ).length;
  const pendingCount = applications.filter(
    (app) => (app.status || "pending").toLowerCase() === "pending"
  ).length;

  const currentPlan = user?.plan ? `${user.plan} Plan` : "Free Plan";
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Row */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            Student Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your tuition applications, tutor responses, and active membership.
          </p>
        </div>

        <Link
          href="/dashboard/student/upgrade"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
        >
          <CreditCard className="h-4 w-4" />
          <span>Upgrade to Student Pro ($10)</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Applied Tuitions
          </p>
          <p className="mt-2.5 text-3xl font-bold text-slate-900 dark:text-white">
            {totalApplied}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Accepted Applications
          </p>
          <p className="mt-2.5 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {acceptedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pending Applications
          </p>
          <p className="mt-2.5 text-3xl font-bold text-amber-500 dark:text-amber-400">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Current Plan
          </p>
          <p className="mt-2.5 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currentPlan}
          </p>
        </div>
      </div>

      {/* Recent Applications Card */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Applications
          </h2>
          <Link
            href="/dashboard/student/my-applications"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                <th className="px-6 py-3.5">Tuition Title</th>
                <th className="px-6 py-3.5">Tutor</th>
                <th className="px-6 py-3.5 text-right">Monthly Fee</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800">
              {recentApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-xs text-slate-500"
                  >
                    You haven&apos;t applied to any tuition batches yet.
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => {
                  const status = (app.status || "pending").toLowerCase();

                  return (
                    <tr
                      key={app._id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {app.tuition_title}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                        {app.teacher_name}
                      </td>

                      <td className="px-6 py-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        BDT {Number(app.monthlyFee || 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {status === "accepted" ? (
                          <span className="inline-flex items-center justify-end gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Accepted
                          </span>
                        ) : status === "rejected" ? (
                          <span className="inline-flex items-center justify-end gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                            <XCircle className="h-3.5 w-3.5" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-end gap-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}