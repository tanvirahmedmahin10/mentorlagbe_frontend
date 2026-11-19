"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { AdminTuitionItem } from "../dashboard/admin/approvals/page";


interface TuitionApprovalTableProps {
  initialTuitions: AdminTuitionItem[];
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function TuitionApprovalTable({
  initialTuitions,
}: TuitionApprovalTableProps) {
  const [tuitions, setTuitions] = useState<AdminTuitionItem[]>(initialTuitions);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (
    tuitionId: string,
    newStatus: "approved" | "rejected"
  ) => {
    const previousTuitions = [...tuitions];

    setTuitions((prev) =>
      prev.map((item) =>
        item._id === tuitionId ? { ...item, status: newStatus } : item
      )
    );
    setUpdatingId(tuitionId);

    try {
      const res = await fetch(`${baseBackendUrl}/tuitions/${tuitionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        setTuitions(previousTuitions);
        toast.error("Failed to update tuition status");
        return;
      }

      toast.success(
        newStatus === "approved" ? "Tuition approved!" : "Tuition rejected"
      );
    } catch {
      setTuitions(previousTuitions);
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
              <th className="px-6 py-3.5">Tuition Post</th>
              <th className="px-6 py-3.5">Tutor</th>
              <th className="px-6 py-3.5 text-right">Fee</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Moderation</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800">
            {tuitions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-500">
                  No tuition posts found.
                </td>
              </tr>
            ) : (
              tuitions.map((item) => {
                const status = (item.status || "pending").toLowerCase();
                const isUpdating = updatingId === item._id;

                return (
                  <tr
                    key={item._id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                  >
                   
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {item.subject} &middot; {item.classLevel} &middot; {item.teachingMode}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {item.teacher_name || "Unknown Tutor"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {item.teacher_email}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      BDT {Number(item.monthlyFee || 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      {status === "approved" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approved
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
                          disabled={isUpdating || status === "approved"}
                          onClick={() => handleStatusChange(item._id, "approved")}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300 dark:disabled:bg-emerald-900/50 dark:disabled:text-emerald-300/60"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating || status === "rejected"}
                          onClick={() => handleStatusChange(item._id, "rejected")}
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