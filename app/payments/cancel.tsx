import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import {
  XCircle,
  ArrowLeft,
  CreditCard,
  ShieldAlert,
  Mail,
} from "lucide-react";
import { auth } from "@/lib/auth";

export default async function CancelPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as { role?: string } | undefined;
  const role = user?.role?.toLowerCase();
  const dashboardPath =
    role === "tutor"
      ? "/dashboard/tutor"
      : role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/student";

  return (
    <div className="flex min-h-[82vh] items-center justify-center bg-slate-50/60 px-4 py-12 sm:px-6 dark:bg-slate-950">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Top Status Header */}
        <div className="border-b border-slate-100 bg-gradient-to-b from-amber-50/80 to-white px-6 pb-7 pt-9 text-center sm:px-10 dark:border-slate-800 dark:from-amber-950/30 dark:to-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
            <XCircle className="h-9 w-9" />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Checkout Canceled</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Payment Not Completed
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            You canceled the Stripe checkout session. No charges were made to
            your card, and your current plan remains unchanged.
          </p>
        </div>

        {/* Body & Action Buttons */}
        <div className="px-6 py-6 sm:px-10">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">
              Want to upgrade later?
            </p>
            <p className="mt-1">
              You can continue using MentorLagbe on the Free Plan or return to
              the subscription page anytime to unlock lifetime Pro access.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/payments"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              <CreditCard className="h-4 w-4" />
              <span>Try Again</span>
            </Link>

            <Link
              href={session?.user ? dashboardPath : "/"}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{session?.user ? "Back to Dashboard" : "Back to Home"}</span>
            </Link>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span>
              Having trouble paying? Contact{" "}
              <a
                href="mailto:support@mentorlagbe.com"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                support@mentorlagbe.com
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}