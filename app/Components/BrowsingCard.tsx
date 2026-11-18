"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { TuitionPostPayload } from "@/lib/postApiBackend/postData";

type TeachingModeFilter = "All" | "Online" | "Offline" | "Hybrid";

interface BrowsingClientProps {
  initialData: TuitionPostPayload[];
}

export default function BrowsingClient({ initialData }: BrowsingClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") ?? "";
  const selectedSubject = searchParams.get("subject") ?? "";
  const selectedClassLevel = searchParams.get("classLevel") ?? "";
  const selectedMode =
    (searchParams.get("teachingMode") as TeachingModeFilter | null) ?? "All";

  const updateFilterParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilterParam("search", e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilterParam("subject", e.target.value);
  };

  const handleClassLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilterParam("classLevel", e.target.value);
  };

  const handleModeChange = (mode: TeachingModeFilter) => {
    updateFilterParam("teachingMode", mode);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Browse Approved Tuitions
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Search live batches and 1-on-1 mentorship posts filtered dynamically on the server.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="relative md:col-span-6">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                defaultValue={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by tuition title, subject, or location..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
            </div>

      
            <div className="md:col-span-3">
              <select
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                <option value="Programming">Programming</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="ICT">ICT</option>
                <option value="English">English</option>
                <option value="Accounting">Accounting</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedClassLevel}
                onChange={handleClassLevelChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:focus:border-blue-500"
              >
                <option value="">All Class Levels</option>
                <option value="Class 6-8">Class 6-8</option>
                <option value="SSC / Class 9-10">SSC / Class 9-10 </option>
                <option value="HSC / Class 11-12">HSC / Class 11-12</option>
                <option value="University Admission">University Admission</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Skill Development">Skill Development</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Mode:
              </span>
              <div className="flex items-center gap-1.5">
                {(["All", "Online", "Offline", "Hybrid"] as TeachingModeFilter[]).map(
                  (mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleModeChange(mode)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                        selectedMode === mode
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-500 hover:bg-slate-100/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                      }`}
                    >
                      {mode}
                    </button>
                  )
                )}
              </div>
            </div>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {initialData.length} {initialData.length === 1 ? "listing" : "listings"} found
            </span>
          </div>
        </div>

        {initialData.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              No tuition batches found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {initialData.map((tuition) => (
              <div
                key={tuition._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {tuition.bannerImage ? (
                    <Image
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-blue-600 dark:from-slate-800 dark:to-slate-900 dark:text-blue-400">
                      <BookOpen className="h-10 w-10 opacity-70" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {tuition.subject}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {tuition.classLevel}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {tuition.teachingMode}
                    </span>
                  </div>

                  <h2 className="mt-2 line-clamp-2 text-[17px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {tuition.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {tuition.description}
                  </p>

                  <div className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {tuition.teacher_name}
                  </div>

                  <div className="mt-3.5 mb-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{tuition.location}</span>
                  </div>

                  <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="pt-3">
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        BDT {tuition.monthlyFee.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">
                          /mo
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {tuition.daysPerWeek} days/week
                      </p>
                    </div>

                    <Link
                      href={`/tuitions/${tuition._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}