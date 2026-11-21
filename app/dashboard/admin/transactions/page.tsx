import React from "react";
import { authFetch } from "@/lib/actions/server";

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

interface PaymentTransaction {
  _id: string;
  sessionId?: string;
  payment_intent: string;
  userId?: string;
  userName?: string;
  customer_email?: string;
  role?: string;
  plan?: string;
  amount?: number;
  payment_status?: string;
  payment_date?: string;
}

export default async function AdminTransactionsPage() {
  const res = await authFetch(`${baseBackendUrl}/payments`);
const transactions: PaymentTransaction[] = res.ok ? await res.json() : [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          Stripe Subscription Transactions
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Verified Pro Plan payments recorded in the payments collection.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="px-6 py-3.5 font-medium">User</th>
                <th className="px-6 py-3.5 font-medium">Role</th>
                <th className="px-6 py-3.5 font-medium">Plan</th>
                <th className="px-6 py-3.5 text-right font-medium">Amount</th>
                <th className="px-6 py-3.5 font-medium">Transaction ID</th>
                <th className="px-6 py-3.5 text-right font-medium">
                  Payment Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No verified subscription transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isTutor = tx.role?.toLowerCase() === "tutor";
                  const formattedDate = tx.payment_date
                    ? new Date(tx.payment_date).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={tx._id}
                      className="transition-colors odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/30 dark:hover:bg-slate-800/60"
                    >
                     
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {tx.userName || "User"}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {tx.customer_email || "—"}
                        </div>
                      </td>

                   
                      <td className="px-6 py-4 text-xs font-medium text-slate-700 capitalize dark:text-slate-300">
                        {tx.role || (isTutor ? "Tutor" : "Student")}
                      </td>

                 
                      <td className="px-6 py-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {tx.plan ||
                          (isTutor ? "Pro Tutor Plan" : "Pro Student Plan")}
                      </td>

               
                      <td className="px-6 py-4 text-right text-xs font-bold text-slate-900 dark:text-white">
                        ${tx.amount ?? (isTutor ? 15 : 10)} USD
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {tx.payment_intent || tx.sessionId || "—"}
                      </td>

                 
                      <td className="px-6 py-4 text-right text-xs text-slate-500 dark:text-slate-400">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}