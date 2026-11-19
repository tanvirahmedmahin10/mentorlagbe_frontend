import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { FetchTeacherData } from "@/lib/getApiBackend/getData";
import { TuitionApplicationType } from "@/lib/types/type";
import ManageApplicantsTable from "@/app/Components/ManageApplicantsTable";


export default async function ApplicantsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const allData: TuitionApplicationType[] =
    (await FetchTeacherData(user?.id, "applications")) ?? [];
    const data=allData.filter(post=>post.teacher_id===user?.id)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
          Manage Applicants
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review student inquiries, preferred schedules, and accept or decline applications.
        </p>
      </div>

      <ManageApplicantsTable initialApplicants={data} />
    </div>
  );
}