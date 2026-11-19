import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { FetchStudentData } from "@/lib/getApiBackend/getData";

import { TuitionApplicationType } from "@/lib/types/type";
import MyApplicationsTable from "@/app/Components/StudentApplicationTable";

export default async function StudentApplications() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const data: TuitionApplicationType[] =
    (await FetchStudentData(user?.id, "applications")) ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track tutor decisions or cancel any application while its status is still pending.
          </p>
        </div>

        <Link
          href="/browse-tuitions"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-colors hover:bg-blue-700"
        >
          Find More Tuitions
        </Link>
      </div>

      <MyApplicationsTable initialApplications={data} />
    </div>
  );
}