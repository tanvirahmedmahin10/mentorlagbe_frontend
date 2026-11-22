import ManageUsersTable from "@/app/Components/ManageUsersTable";
import { authFetch } from "@/lib/actions/server";


export interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  role?: "student" | "tutor" | "admin";
  plan?: string;
  premium?: boolean;
  createdAt?: string;
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default async function ManageUsersPage() {
const res = await authFetch(`${baseBackendUrl}/users`);
const users: PlatformUser[] = res.ok ? await res.json() : []

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
          User &amp; Role Management
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage registered Students, Tutors, and Admins across the platform.
        </p>
      </div>

      <ManageUsersTable initialUsers={users} />
    </div>
  );
}