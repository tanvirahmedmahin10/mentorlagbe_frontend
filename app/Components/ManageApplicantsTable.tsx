"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { TuitionApplicationType } from "@/lib/types/type";

interface ManageApplicantsTableProps {
  initialApplicants: TuitionApplicationType[];
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function ManageApplicantsTable({
  initialApplicants,
}: ManageApplicantsTableProps) {
  const [applicants, setApplicants] =
    useState<TuitionApplicationType[]>(initialApplicants);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDecision = async (
    applicationId: string,
    newStatus: "accepted" | "rejected"
  ) => {
    const previous = [...applicants];

    setApplicants((prev) =>
      prev.map((item) =>
        item._id === applicationId ? { ...item, status: newStatus } : item
      )
    );
    setUpdatingId(applicationId);

    try {
      const res = await fetch(
        `${baseBackendUrl}/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        setApplicants(previous);
        toast.error("Failed to update application status");
        return;
      }

      toast.success(
        newStatus === "accepted" ? "Application accepted!" : "Application rejected"
      );
    } catch {
      setApplicants(previous);
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Tuition &amp; Schedule</th>
              <th className="px-6 py-3.5">Learning Note</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Decision</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800">
            {applicants.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-xs text-slate-500"
                >
                  No student applications yet.
                </td>
              </tr>
            ) : (
              applicants.map((app) => {
                const status = (app.status || "pending").toLowerCase();
                const isUpdating = updatingId === app._id;

                return (
                  <tr
                    key={app._id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                  >
                
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {app.student_name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {app.student_email}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {app.contactNumber}
                      </p>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                        {app.tuition_title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {app.preferredSchedule}
                      </p>
                    </td>

                    <td className="max-w-xs px-6 py-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {app.note || "No note provided."}
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
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isUpdating || status === "accepted"}
                          onClick={() => handleDecision(app._id!, "accepted")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 dark:disabled:bg-emerald-900/50 dark:disabled:text-emerald-300/60"
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating || status === "rejected"}
                          onClick={() => handleDecision(app._id!, "rejected")}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}