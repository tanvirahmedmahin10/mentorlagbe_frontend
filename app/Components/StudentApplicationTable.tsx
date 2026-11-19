"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { TuitionApplicationType } from "@/lib/types/type";


interface MyApplicationsTableProps {
  initialApplications: TuitionApplicationType[];
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function MyApplicationsTable({
  initialApplications,
}: MyApplicationsTableProps) {
  const [applications, setApplications] =
    useState<TuitionApplicationType[]>(initialApplications);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const handleCancelApplication = async (applicationId?: string) => {
    if (!applicationId) return;

    setCancelingId(applicationId);
    try {
      const res = await fetch(`${baseBackendUrl}/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to cancel application");
        return;
      }

      setApplications((prev) => prev.filter((item) => item._id !== applicationId));
      toast.success("Application cancelled");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCancelingId(null);
    }
  };

  const formatDate = (dateValue?: string | Date) => {
    if (!dateValue) return new Date().toLocaleDateString("en-US");
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          You haven&apos;t applied to any tuition batches yet.
        </p>
        <Link
          href="/browse-tuitions"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Browse Tuitions
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <th className="px-6 py-3.5">Tuition Title</th>
              <th className="px-6 py-3.5">Tutor</th>
              <th className="px-6 py-3.5">Monthly Fee</th>
              <th className="px-6 py-3.5">Applied Date</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800">
            {applications.map((app) => {
              const status = (app.status || "pending").toLowerCase();
              const isCanceling = cancelingId === app._id;

              return (
                <tr
                  key={app._id}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {app.tuition_title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      {app.preferredSchedule}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {app.teacher_name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      {app.teacher_email}
                    </p>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    BDT {Number(app.monthlyFee || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                    {formatDate((app as { createdAt?: string }).createdAt)}
                  </td>

                  <td className="px-6 py-4">
                    {status === "accepted" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accepted
                      </span>
                    ) : status === "rejected" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                        <XCircle className="h-3.5 w-3.5" />
                        Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    )}
                  </td>

             
                  <td className="px-6 py-4 text-right">
                    {status === "pending" ? (
                      <button
                        type="button"
                        disabled={isCanceling}
                        onClick={() => handleCancelApplication(app._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        {isCanceling ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span>Cancel</span>
                      </button>
                    ) : (
                      <Link
                        href={`/browse-tuitions/${app.tuition_id}`}
                        className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
                      >
                        View / Review
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}