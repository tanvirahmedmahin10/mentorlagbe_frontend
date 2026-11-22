import React from "react";
import Link from "next/link";
import { Check, CreditCard, ShieldCheck } from "lucide-react";

interface HomePricingProps {
  isSignedIn: boolean;
  isPro: boolean;
}

const plans = [
  {
    role: "Student",
    title: "Student Pro",
    price: 10,
    features: [
      "Unlimited tuition applications",
      "Priority booking highlight in tutor queues",
      "Full application status tracking",
    ],
    dark: false,
  },
  {
    role: "Tutor",
    title: "Tutor Pro",
    price: 15,
    features: [
      "Unlimited tuition batch postings",
      "Verified Pro Tutor shield on listings",
      "Priority placement in Browse Tuitions",
    ],
    dark: true,
  },
];

export default function HomePricing({ isSignedIn, isPro }: HomePricingProps) {
  return (
    <section className="border-y border-slate-100 bg-white px-4 py-14 sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
            MentorLagbe Pro Plans
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            Free to start, Pro when you need more
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Upgrade once and unlock unlimited activity for your role. Free plans
            stay available for students and tutors who are just getting started.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.role}
              className={`flex flex-col justify-between rounded-2xl border p-6 shadow-2xs ${
                plan.dark
                  ? "border-slate-800 bg-slate-950 text-white"
                  : "border-2 border-blue-600 bg-white dark:bg-slate-900"
              }`}
            >
              <div>
                <h3
                  className={`flex items-center gap-1.5 text-sm font-semibold ${
                    plan.dark
                      ? "text-blue-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{plan.title}</span>
                </h3>

                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.dark
                        ? "text-white"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span className="text-xs text-slate-400">/lifetime</span>
                </div>

                <ul className="mt-6 space-y-3 text-xs">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.dark ? "text-emerald-400" : "text-emerald-500"
                        }`}
                      />
                      <span
                        className={
                          plan.dark
                            ? "text-slate-300"
                            : "text-slate-600 dark:text-slate-300"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {isPro ? (
                  <span
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
                      plan.dark
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>Already Subscribed</span>
                  </span>
                ) : (
                  <Link
                    href={isSignedIn ? "/payments" : "/signin"}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                      plan.dark
                        ? "bg-white text-slate-900 hover:bg-slate-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Subscribe with Stripe</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Free plans: up to 2 tuition posts for tutors and 2 applications for
          students.{" "}
          <Link
            href="/pricing"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Compare all plans
          </Link>
        </p>
      </div>
    </section>
  );
}
