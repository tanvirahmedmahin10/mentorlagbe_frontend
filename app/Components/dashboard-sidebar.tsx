"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutGrid,
  FileText,
  FilePlus2,
  Users,
  CheckSquare,
  CreditCard,
  UserCog,
  Home,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

type UserRole = "student" | "tutor" | "admin";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

const roleMenus: Record<UserRole, NavItem[]> = {
  student: [
    { name: "Overview", url: "/dashboard/student", icon: LayoutGrid },
    { name: "My Applications", url: "/dashboard/student/applications", icon: FileText },
    { name: "Update Profile", url: "/dashboard/student/profile", icon: UserCog },
  ],
  tutor: [
    { name: "Overview", url: "/dashboard/tutor", icon: LayoutGrid },
    { name: "Post a Tuition", url: "/dashboard/tutor/post-tuition", icon: FilePlus2 },
    { name: "My Tuitions", url: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    { name: "Manage Applicants", url: "/dashboard/tutor/applicants", icon: Users },
    { name: "Update Profile", url: "/dashboard/tutor/profile", icon: UserCog },
  ],
  admin: [
    { name: "Overview", url: "/dashboard/admin", icon: LayoutGrid },
    { name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Tuition Approvals", url: "/dashboard/admin/approvals", icon: CheckSquare },
    { name: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
    { name: "Update Profile", url: "/dashboard/admin/profile", icon: UserCog },
  ],
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { data: session } = authClient.useSession();

  
  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const user = session?.user;
  const userRole = (user?.role as UserRole | undefined) ?? "student";
  const userName = user?.name ?? "MentorLagbe User";
  const userImage = user?.image;
  const planLabel = userRole === "student" ? "Free Plan" : "Pro Plan";
  const roleLabel = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const menuItems = roleMenus[userRole] ?? roleMenus.student;

  const handleSignOut = async () => {
    setOpenMobile(false);
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/signin");
    router.refresh();
  };

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white md:top-16 md:h-[calc(100svh-4rem)] dark:border-slate-800 dark:bg-slate-950">
  
      <SidebarHeader className="p-0">

        <div className="flex h-16 flex-row items-center gap-3 border-b border-slate-100 px-5 md:hidden dark:border-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
            <BookOpen className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            MentorLagbe
          </span>
        </div>

        <div className="flex flex-row items-center gap-3.5 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/40"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100/80 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              {getInitials(userName) || "ML"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {userName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {roleLabel} · {planLabel}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3.5 py-4">
        <SidebarMenu className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => setOpenMobile(false)}
                  className={`h-11 rounded-xl px-4 text-[14px] font-medium transition-all ${
                    isActive
                      ? "!bg-blue-600 !text-white shadow-sm shadow-blue-600/20 hover:!bg-blue-700"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`}
                  render={<Link href={item.url} />}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom Footer Actions */}
      <SidebarFooter className="border-t border-slate-100 p-3.5 dark:border-slate-800">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              className="h-10 rounded-xl px-4 text-[14px] font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              render={<Link href="/" />}
            >
              <Home className="h-[18px] w-[18px] text-slate-500 dark:text-slate-400" />
              <span>Browse Public Site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="h-10 cursor-pointer rounded-xl px-4 text-[14px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
            >
              <LogOut className="h-[18px] w-[18px]" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}