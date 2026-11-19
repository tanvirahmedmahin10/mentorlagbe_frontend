import TuitionApprovalTable from "@/app/Components/TuitionApprovalTable";
import { baseBackendUrl } from "@/lib/postApiBackend/postData";


export interface AdminTuitionItem {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  teachingMode: string;
  monthlyFee: number;
  teacher_name?: string;
  teacher_email?: string;
  status?: "pending" | "approved" | "rejected";
}

export default async function TuitionApprovalPage() {
  const res = await fetch(`${baseBackendUrl}/tuitions`, { cache: "no-store" });
  const tuitions: AdminTuitionItem[] = res.ok ? await res.json() : [];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
          Tuition Approval Queue
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Approve or reject tutor listings. Only approved &amp; active tuitions appear on the public marketplace.
        </p>
      </div>

      <TuitionApprovalTable initialTuitions={tuitions} />
    </div>
  );
}