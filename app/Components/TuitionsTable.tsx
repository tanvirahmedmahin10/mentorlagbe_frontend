"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FilePlus2,
  Clock,
  CheckCircle2,
  XCircle,
  Power,
  Pencil,
  Trash2,
  BookOpen,
} from "lucide-react";

import EditButtons from "./ButtonForTutors/EditButtons";
import { TuitionPostPayload } from "@/lib/types/type";

export type TutorTuitionItem = TuitionPostPayload & {
  status?: "Pending" | "Approved" | "Rejected";
  availability?: "Active" | "Closed";
};

interface MyTuitionsClientProps {
  initialData: TutorTuitionItem[];
}

export default function MyTuitionsClient({
  initialData,
}: MyTuitionsClientProps) {
  const [tuitions, setTuitions] = useState<TutorTuitionItem[]>(initialData);

  const handleToggleAvailability = async (tuition: TutorTuitionItem) => {
    // TODO: Implement toggle Active/Closed API call
  };



  const handleDeleteTuition = async (tuitionId: string) => {
    // TODO: Implement delete API call
  };

  return (
    <div className="mx-auto max-w-6xl">
     
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            My Created Tuitions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edit details, toggle batch visibility (Active/Closed), or remove listings.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.99]"
        >
          <FilePlus2 className="h-4 w-4" />
          <span>New Tuition Post</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        {tuitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              No tuition posts yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create your first tuition batch to start receiving applications.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                  <th className="py-3.5 pl-6 pr-4 font-medium">Tuition</th>
                  <th className="px-4 py-3.5 text-right font-medium">Fee</th>
                  <th className="px-4 py-3.5 font-medium">Admin Review</th>
                  <th className="px-4 py-3.5 font-medium">Availability</th>
                  <th className="py-3.5 pl-4 pr-6 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {tuitions.map((tuition) => {
                  const reviewStatus = tuition.status ?? "Pending";
                  const isAvailable = (tuition.availability ?? "Active") === "Active";

                  return (
                    <tr
                      key={tuition._id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                    >
                   
                      <td className="py-4 pl-6 pr-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {tuition.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {tuition.subject} · {tuition.classLevel} ·{" "}
                          {tuition.teachingMode}
                        </p>
                      </td>

                 
                      <td className="whitespace-nowrap px-4 py-4 text-right font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        BDT {tuition.monthlyFee.toLocaleString()}
                      </td>

                     
                      <td className="whitespace-nowrap px-4 py-4">
                        {reviewStatus === "Approved" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approved</span>
                          </span>
                        )}

                        {reviewStatus === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Pending</span>
                          </span>
                        )}

                        {reviewStatus === "Rejected" && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                 
                      <td className="whitespace-nowrap px-4 py-4">
                        {isAvailable ? (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                            Closed
                          </span>
                        )}
                      </td>

                 
                      <td className="whitespace-nowrap py-4 pl-4 pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            title={
                              isAvailable ? "Close Batch" : "Activate Batch"
                            }
                            onClick={() => handleToggleAvailability(tuition)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>

                         <EditButtons
                          tuition={tuition}
                          onUpdated={(updated) =>
                          setTuitions((prev) =>
                        prev.map((item) => (item._id === updated._id ? updated : item))
    )
  }
/>

                          <button
                            type="button"
                            title="Delete Tuition"
                            onClick={() =>
                              tuition._id && handleDeleteTuition(tuition._id)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}