import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { FilePlus2, CreditCard, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { FetchTeacherData } from "@/lib/getApiBackend/getData";
import { TuitionPostPayload, TuitionApplicationType } from "@/lib/types/type";

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default async function TutorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as
    | { id: string; name?: string; email?: string }
    | undefined;

  const [tuitions, applications, premiumRes] = await Promise.all([
    FetchTeacherData(user?.id, "tuitions").then(
      (res) => (res ?? []) as TuitionPostPayload[]
    ),
    FetchTeacherData(user?.id, "applications").then(
      (res) => (res ?? []) as TuitionApplicationType[]
    ),
    user?.id
      ? fetch(`${baseBackendUrl}/users/${user.id}/premium`, {
          cache: "no-store",
        }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const premiumData = premiumRes?.ok
    ? await premiumRes.json()
    : { premium: false };
  const isPremium = Boolean(premiumData?.premium);

  const totalApplicantsData = applications.filter(
    (post) => post.teacher_id === user?.id
  );
  const totalTuitions = tuitions.length;
  const approvedTuitions = tuitions.filter(
    (item) => item.status?.toLowerCase() === "approved"
  ).length;
  const totalApplicants = totalApplicantsData.length;
  const pendingApplicants = totalApplicantsData.filter(
    (item) => (item.status || "pending").toLowerCase() === "pending"
  ).length;

  const currentPlan = isPremium ? "Pro Plan" : "Free Plan";

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header Row */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            Tutor Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your posted tuition batches, admin approval statuses, and student applicants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isPremium ? (
            <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Tutor Pro Active</span>
            </span>
          ) : (
            <Link
              href="/payments"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Upgrade to Pro ($15)</span>
            </Link>
          )}

          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
          >
            <FilePlus2 className="h-4 w-4" />
            <span>Post a Tuition</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Tuitions Posted
          </p>
          <p className="mt-2.5 text-3xl font-bold text-slate-900 dark:text-white">
            {totalTuitions}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active &amp; Approved
          </p>
          <p className="mt-2.5 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {approvedTuitions}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Applicants Received
          </p>
          <p className="mt-2.5 text-3xl font-bold text-slate-900 dark:text-white">
            {totalApplicants}
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

      {/* Quick Navigation Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
        >
          <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            Manage Created Tuitions
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Edit curriculum details, toggle Active/Closed availability, or check Admin approval progress.
          </p>
        </Link>

        <Link
          href="/dashboard/tutor/applicants"
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
        >
          <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            Review Student Applicants ({pendingApplicants} pending)
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Inspect student phone numbers, preferred schedules, and accept or reject enrollment requests.
          </p>
        </Link>
      </div>
    </div>
  );
}