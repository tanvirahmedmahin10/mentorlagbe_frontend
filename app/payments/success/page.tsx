import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Receipt,
  Mail,
} from "lucide-react";
import { stripe } from "@/lib/stripe";
import { checkoutVerify } from "@/lib/actions/payments";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const {
    status,
    customer_email,
    metadata,
    payment_status,
    amount_total,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete" && payment_status === "paid") {
    await checkoutVerify(session_id);

    const isTutor = metadata?.role?.toLowerCase() === "tutor";
    const planName = isTutor ? "Tutor Pro Plan" : "Student Pro Plan";
    const dashboardPath = isTutor ? "/dashboard/tutor" : "/dashboard/student";
    const browseOrPostPath = isTutor
      ? "/dashboard/tutor/post-tuition"
      : "/browse-tuitions";
    const amountPaid = amount_total ? (amount_total / 100).toFixed(2) : isTutor ? "15.00" : "10.00";

    return (
      <div className="flex min-h-[82vh] items-center justify-center bg-slate-50/60 px-4 py-12 sm:px-6 dark:bg-slate-950">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="border-b border-slate-100 bg-gradient-to-b from-emerald-50/80 to-white px-6 pb-7 pt-9 text-center sm:px-10 dark:border-slate-800 dark:from-emerald-950/30 dark:to-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Membership Activated</span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Payment Successful!
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Your account has been upgraded to{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {planName}
              </span>
              . Unlimited platform features are now unlocked.
            </p>
          </div>


          <div className="px-6 py-6 sm:px-10">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Receipt className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Transaction Summary</span>
              </div>

              <dl className="mt-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Plan</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">
                    {planName} (Lifetime)
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Amount Paid
                  </dt>
                  <dd className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    ${amountPaid} USD
                  </dd>
                </div>

                {customer_email && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500 dark:text-slate-400">
                      Receipt Sent To
                    </dt>
                    <dd className="truncate font-medium text-slate-700 dark:text-slate-300">
                      {customer_email}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">
                    Session Reference
                  </dt>
                  <dd className="max-w-[180px] truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {session_id}
                  </dd>
                </div>
              </dl>
            </div>


            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href={dashboardPath}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={browseOrPostPath}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
              >
                {isTutor ? "Post a Tuition" : "Browse Tuitions"}
              </Link>
            </div>

      
            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>
                Need help? Contact{" "}
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

  return redirect("/payments/cancel");
}