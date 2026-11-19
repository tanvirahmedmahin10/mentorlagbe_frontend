"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { FetchPostApplyData } from "@/lib/postApiBackend/postData";
import { TuitionApplicationPayload, TuitionPostPayload } from "@/lib/types/type";

interface ApplyTuitionCardProps {
  tuition: TuitionPostPayload;
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function ApplyTuitionCard({ tuition }: ApplyTuitionCardProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { id: string; name?: string; email?: string; role?: string }
    | undefined;

  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [existingApplication, setExistingApplication] =
    useState<TuitionApplicationPayload | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const userRole = user?.role?.toLowerCase();
  const isStudent = userRole === "student";

  useEffect(() => {
    if (!isStudent || !user?.id || !tuition?._id) return;

    const checkExistingApplication = async () => {
      setCheckingStatus(true);
      try {
        const res = await fetch(
          `${baseBackendUrl}/applications?student_id=${encodeURIComponent(
            user.id
          )}&tuition_id=${encodeURIComponent(tuition._id)}`
        );
        if (!res.ok) return;

        const data: TuitionApplicationPayload[] = await res.json();
        const existing = Array.isArray(data)
          ? data.find((app) => app.tuition_id === tuition._id)
          : undefined;
        setExistingApplication(existing ?? null);
      } catch {
        toast.error('something went wrong')
      } finally {
        setCheckingStatus(false);
      }
    };

    checkExistingApplication();
  }, [isStudent, user?.id, tuition?._id]);

  const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isStudent || !user) return;

    const applicationData = {
      tuition_id: tuition._id,
      tuition_title: tuition.title,
      subject: tuition.subject,
      classLevel: tuition.classLevel,
      teachingMode: tuition.teachingMode,
      monthlyFee: tuition.monthlyFee,
      teacher_id: tuition.teacher_id,
      teacher_name: tuition.teacher_name,
      teacher_email: tuition.teacher_email,
      student_id: user.id,
      student_name: user.name ?? "",
      student_email: user.email ?? "",
      preferredSchedule: preferredSchedule.trim(),
      contactNumber: contactNumber.trim(),
      note: note.trim(),
      status: "pending" as const,
    };

    setSubmitting(true);
    try {
      const res = await FetchPostApplyData(applicationData, "applications");
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        toast.error(errData?.message || "Failed to submit application");
        return;
      }

      const result = await res.json().catch(() => null);
      toast.success("Application submitted successfully!");

      setExistingApplication({
        ...applicationData,
        _id: result?.insertedId ?? "",
      });
      setPreferredSchedule("");
      setContactNumber("");
      setNote("");
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        Apply for This Tuition
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Submit your preferred schedule and contact number directly to{" "}
        {tuition.teacher_name || "the tutor"}.
      </p>

      {isPending || checkingStatus ? (
        <div className="mt-5 flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
        </div>
      ) : !user ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
            Please sign in with a <span className="font-semibold">Student</span>{" "}
            account to apply for tuition batches.
          </div>

          <Link
            href="/sign-in"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700"
          >
            Sign In to Apply
          </Link>
        </div>
      ) : !isStudent ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
            You are signed in as a{" "}
            <span className="font-semibold capitalize">
              {user.role || "Tutor"}
            </span>
            . Only Student accounts can apply for tuition batches.
          </div>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-slate-200/80 px-4 py-2.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            Apply Now (Students Only)
          </button>
        </div>
      ) : existingApplication ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Application Submitted</span>
            </div>
            <p className="mt-1.5 text-xs text-emerald-700/90 dark:text-emerald-300/90">
              Current status:{" "}
              <span className="font-semibold capitalize">
                {existingApplication.status || "Pending"}
              </span>
            </p>
          </div>

          <Link
            href="/dashboard/student/applications"
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
          >
            Manage in My Applications
          </Link>
        </div>
      ) : (
        <form onSubmit={handleApplySubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Preferred Schedule *
            </label>
            <input
              type="text"
              required
              value={preferredSchedule}
              onChange={(e) => setPreferredSchedule(e.target.value)}
              placeholder="e.g. Sat, Mon, Wed at 7:00 PM"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Contact Number *
            </label>
            <input
              type="tel"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. 017XXXXXXXX"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Message / Note (Optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mention your current class or learning goals..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Apply Now</span>
          </button>
        </form>
      )}
    </div>
  );
}