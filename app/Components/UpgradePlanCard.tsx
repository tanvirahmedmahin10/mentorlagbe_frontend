"use client";

import  { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";


interface UpgradePlanCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
  };
}

export default function UpgradePlanCard({ user }: UpgradePlanCardProps) {
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(false);

  const canceled = searchParams.get("canceled") === "true";

  const normalizedRole = user.role.toLowerCase();
  const isTutor = normalizedRole === "tutor";
  const isAlreadyPro = user.plan.toLowerCase() === "pro";

  const price = isTutor ? 15 : 10;
  const planTitle = isTutor ? "Tutor Pro Plan" : "Student Pro Plan";
  const dashboardPath = isTutor ? "/dashboard/tutor" : "/dashboard/student";

  const features = isTutor
    ? [
        "Unlimited tuition batch postings",
        "Verified Tutor badge on all listings",
        "Priority placement in Browse Tuitions",
        "Direct student applicant management",
      ]
    : [
        "Apply to unlimited tuition batches",
        "Priority review from verified tutors",
        "Direct schedule & contact requests",
        "Full application status tracking",
      ];



  if (isAlreadyPro) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-200/80 bg-white p-8 text-center shadow-2xs dark:border-emerald-900/50 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          You&apos;re Already on {planTitle}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Your account has full unlimited access enabled.
        </p>
        <Link
          href={dashboardPath}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {canceled && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Checkout was canceled. You can try again anytime below.</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-6 sm:p-8 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {planTitle}
            </span>
            <span className="text-xs font-medium text-slate-400">
              One-time fee
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ${price}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              USD / lifetime
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Signed in as{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {user.email}
            </span>
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <ul className="space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Check className="h-3 w-3" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

        <form
            action="/api/checkout_sessions"
            method="POST"
            onSubmit={() => setProcessing(true)}
            className="mt-7"
          >
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="userName" value={user.name} />
            <input type="hidden" name="userEmail" value={user.email} />
            <input type="hidden" name="role" value={normalizedRole} />

            <button
              type="submit"
              role="link"
              disabled={processing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-70"
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              <span>
                {processing
                  ? "Redirecting to Stripe..."
                  : `Pay $${price} & Upgrade Now`}
              </span>
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Instant account activation upon confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}