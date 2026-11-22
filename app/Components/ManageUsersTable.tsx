"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { PlatformUser } from "../dashboard/admin/users/page";
import { protectedMutation } from "@/lib/actions/server";


interface ManageUsersTableProps {
  initialUsers: PlatformUser[];
}

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;

export default function ManageUsersTable({ initialUsers }: ManageUsersTableProps) {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: "student" | "tutor" | "admin") => {
    const previousUsers = [...users];

    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
    );
    setUpdatingId(userId);

 try {
      const result = await protectedMutation(
        `${baseBackendUrl}/users/${userId}/role`,
        "PATCH",
        { role: newRole }
      );

      if (!result?.modifiedCount) {
        setUsers(previousUsers);
        toast.error("Failed to update user role");
        return;
      }

      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      setUsers(previousUsers);
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "—";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <th className="px-6 py-3.5">User</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">Plan</th>
              <th className="px-6 py-3.5">Joined</th>
              <th className="px-6 py-3.5 text-right">Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-500">
                  No registered users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const currentRole = (user.role || "student") as "student" | "tutor" | "admin";
                const isProPlan =
                  user.plan?.toLowerCase() === "pro" || user.premium === true;
                const planLabel = isProPlan ? "Pro" : "Free";

                return (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {planLabel}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <select
                        value={currentRole}
                        disabled={updatingId === user._id}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value as "student" | "tutor" | "admin"
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors focus:border-blue-600 focus:outline-none disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        <option value="student">student</option>
                        <option value="tutor">tutor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}