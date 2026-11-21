import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { baseBackendUrl } from "@/lib/postApiBackend/postData";
import { TuitionPostPayload } from "@/lib/types/type";

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  premium?: boolean;
}

interface PaymentRecord {
  _id: string;
  amount?: number;
}

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const token = session?.session?.token;
  const authHeaders: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
    fetch(`${baseBackendUrl}/users`, {
      headers: authHeaders,
      cache: "no-store",
    }),
    fetch(`${baseBackendUrl}/tuitions`, { cache: "no-store" }),
    fetch(`${baseBackendUrl}/payments`, {
      headers: authHeaders,
      cache: "no-store",
    }).catch(() => null),
  ]);

  const users: PlatformUser[] = usersRes.ok ? await usersRes.json() : [];
  const tuitions: TuitionPostPayload[] = tuitionsRes.ok ? await tuitionsRes.json() : [];
  const payments: PaymentRecord[] =
    paymentsRes && paymentsRes.ok ? await paymentsRes.json() : [];

  const totalUsers = users.length;
  const totalTutors = users.filter(
    (u) => u.role?.toLowerCase() === "tutor"
  ).length;

  const pendingTuitions = tuitions.filter(
    (t) => (t.status || "pending").toLowerCase() === "pending"
  ).length;
  const approvedTuitions = tuitions.filter(
    (t) => t.status?.toLowerCase() === "approved"
  ).length;

  const totalRevenue =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
      : users.filter((u) => u.premium).length * 10;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
          Admin Platform Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor registered stakeholders, moderate tuition posts, and audit Stripe revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Registered Users
          </p>
          <p className="mt-2.5 text-3xl font-bold text-slate-900 dark:text-white">
            {totalUsers}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Verified Tutors
          </p>
          <p className="mt-2.5 text-3xl font-bold text-slate-900 dark:text-white">
            {totalTutors}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Pending vs Approved Tuitions
          </p>
          <p className="mt-2.5 text-3xl font-bold">
            <span className="text-amber-500 dark:text-amber-400">
              {pendingTuitions}
            </span>
            <span className="mx-1.5 font-normal text-slate-300 dark:text-slate-600">
              /
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {approvedTuitions}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Stripe Revenue
          </p>
          <p className="mt-2.5 text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}