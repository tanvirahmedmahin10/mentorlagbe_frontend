import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "../Components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />

        
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
              <BookOpen className="h-5 w-5 stroke-[2.2]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              MentorLagbe
            </span>
          </Link>
        </div>
      </header>


      <div className="flex flex-1">
        <DashboardSidebar />
        <SidebarInset className="min-w-0 flex-1 bg-slate-50/60 dark:bg-slate-950">
          <main className="flex-1 p-4 sm:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}