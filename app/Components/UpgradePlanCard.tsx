"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface UpgradePlanCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
  };
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function UpgradePlanCard({ user }: UpgradePlanCardProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const normalizedRole = user.role.toLowerCase();
  const isTutor = normalizedRole === "tutor";
  const isAlreadyPro = user.plan.toLowerCase() === "pro";

  const price = isTutor ? 20 : 10;
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

  const handleUpgrade = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${baseBackendUrl}/payments/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          role: normalizedRole,
          amount: price,
        }),
      });

      if (!res.ok) {
        toast.error("Payment failed. Please try again.");
        return;
      }

      toast.success(`Upgraded to ${planTitle}!`);
      router.push(dashboardPath);
      router.refresh();
    } catch {
      toast.error("Something went wrong during checkout");
    } finally {
      setProcessing(false);
    }
  };

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
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
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
          Signed in as <span className="font-medium text-slate-700 dark:text-slate-300">{user.email}</span>
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

        <button
          type="button"
          disabled={processing}
          onClick={handleUpgrade}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-70"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          <span>
            {processing ? "Processing Upgrade..." : `Pay $${price} & Upgrade Now`}
          </span>
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Instant account activation upon confirmation</span>
        </div>
      </div>
    </div>
  );
}