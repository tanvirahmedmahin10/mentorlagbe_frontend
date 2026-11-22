import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UpgradePlanCard from "../Components/UpgradePlanCard";


export default async function PaymentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as
    | {
        id: string;
        name?: string;
        email?: string;
        role?: string;
        plan?: string;
        premium?: boolean;
      }
    | undefined;

  if (!user) {
    redirect("/signin");
  }

  const plan =
    user.plan?.toLowerCase() === "pro" || user.premium ? "Pro" : "Free";

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-14 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            MentorLagbe Pro Membership
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Upgrade Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            One-time upgrade to unlock unlimited access for your{" "}
            <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">
              {user.role || "student"}
            </span>{" "}
            account.
          </p>
        </div>

        <UpgradePlanCard
          user={{
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",
            role: user.role ?? "student",
            plan,
          }}
        />
      </div>
    </div>
  );
}