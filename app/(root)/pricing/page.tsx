"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function PricingPage() {
  const { data: session } = authClient.useSession();

  const [premiumResult, setPremiumResult] = useState<{
    userId: string;
    premium: boolean;
  } | null>(null);

  const user = session?.user as
    | { id?: string; email?: string; role?: string }
    | undefined;
  const userId = user?.id;
  const userRole = user?.role?.toLowerCase();

  const hasResultForUser = Boolean(userId) && premiumResult?.userId === userId;
  const isPremium = hasResultForUser && Boolean(premiumResult?.premium);
  const checkingPremium = Boolean(userId) && !hasResultForUser;

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchPremiumStatus = async () => {
      let premium = false;
      try {
        const res = await fetch(`${baseBackendUrl}/users/${userId}/premium`);
        if (res.ok) {
          const data = await res.json();
          premium = Boolean(data?.premium);
        }
      } catch {
        premium = false;
      }
      if (!cancelled) {
        setPremiumResult({ userId, premium });
      }
    };

    fetchPremiumStatus();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isStudentSubscribed = isPremium && userRole === "student";
  const isTutorSubscribed = isPremium && userRole === "tutor";

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
   
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
          MentorLagbe Pro Subscriptions
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Plans Designed for Learners &amp; Educators
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Begin free with core access, then unlock unlimited tutor postings or
          priority student booking through Stripe Checkout.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
     
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Student Free
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                $0
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Apply to up to 2 courses / tuitions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Browse &amp; filter all approved tuitions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Cancel pending applications anytime</span>
              </li>
            </ul>
          </div>

          <Link
            href={userId ? "/dashboard/student" : "/signin"}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Open Dashboard
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-sm dark:bg-slate-900">
          <div>
            <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Student Pro
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                $10
              </span>
              <span className="text-xs text-slate-400">/lifetime</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Unlimited course &amp; tuition applications</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Priority booking highlight in tutor queue</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Unlimited saved bookmarks &amp; verified badge</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            {isStudentSubscribed ? (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Already Subscribed</span>
              </button>
            ) : !userId ? (
              <Link
                href="/signin"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4" />
                <span>Subscribe with Stripe</span>
              </Link>
            ) : (
              <form action="/api/checkout_sessions" method="POST">
                <button
                  type="submit"
                  disabled={checkingPremium || userRole !== "student"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Subscribe with Stripe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tutor Free
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                $0
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Publish up to 2 tuition listings</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Direct ImgBB banner image upload</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Accept or reject student applicants</span>
              </li>
            </ul>
          </div>

          <Link
            href={userId ? "/dashboard/tutor" : "/signin"}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Open Dashboard
          </Link>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-6 text-white shadow-sm">
          <div>
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-blue-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Tutor Pro</span>
            </h2>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$15</span>
              <span className="text-xs text-slate-400">/lifetime</span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>Unlimited tuition &amp; 1-on-1 batch postings</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>Verified Pro Tutor shield on all listings</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>Priority placement &amp; full applicant controls</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            {isTutorSubscribed ? (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Already Subscribed</span>
              </button>
            ) : !userId ? (
              <Link
                href="/signin"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                <CreditCard className="h-4 w-4" />
                <span>Subscribe with Stripe</span>
              </Link>
            ) : (
              <form action="/api/checkout_sessions" method="POST">
                <button
                  type="submit"
                  disabled={checkingPremium || userRole !== "tutor"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Subscribe with Stripe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
