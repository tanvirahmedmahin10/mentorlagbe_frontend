import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { FilePlus2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { FetchTeacherData } from "@/lib/getApiBackend/getData";
import { TuitionPostPayload, TuitionApplicationType } from "@/lib/types/type";

export default async function TutorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as
    | { id: string; name?: string; email?: string; plan?: string }
    | undefined;

  const [tuitions, applications]: [
    TuitionPostPayload[],
    TuitionApplicationType[]
  ] = await Promise.all([
    FetchTeacherData(user?.id, "tuitions").then((res) => res ?? []),
    FetchTeacherData(user?.id, "applications").then((res) => res ?? []),
  ]);
 const totalApplicantsData=applications.filter(post=>post.teacher_id===user?.id)
  const totalTuitions = tuitions.length;
  const approvedTuitions = tuitions.filter(
    (item) => item.status?.toLowerCase() === "approved"
  ).length;
  const totalApplicants = totalApplicantsData.length;
  const pendingApplicants = applications.filter(
    (item) => (item.status || "pending").toLowerCase() === "pending"
  ).length;

  const currentPlan = user?.plan ? `${user.plan} Plan` : "Free Plan";

  return (
    <div className="mx-auto max-w-6xl">
 
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            Tutor Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your posted tuition batches, admin approval statuses, and student applicants.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
        >
          <FilePlus2 className="h-4 w-4" />
          <span>Post a Tuition</span>
        </Link>
      </div>

     
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