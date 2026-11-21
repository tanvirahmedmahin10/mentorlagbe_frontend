import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, BookOpen, User } from "lucide-react";
import { FetchGetDetails } from "@/lib/getApiBackend/getData";

import ApplyTuitionCard from "@/app/Components/TuitionDetailsCard";
import { TuitionPostPayload } from "@/lib/types/type";
import { notFound } from "next/navigation";


export interface IParams {
  params: Promise<{
    browse_id: string;
  }>;
}

const DetailsPage = async ({ params }: IParams) => {
  const { browse_id } = await params;
  const res: TuitionPostPayload | null = await FetchGetDetails(browse_id);

  if (!res) {
    notFound();
   
  }

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-8 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
   
        <Link
          href="/browse-tuitions"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Browse Tuitions</span>
        </Link>

    
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
         
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          
            <div className="relative h-64 w-full bg-slate-100 sm:h-80 md:h-[360px] dark:bg-slate-800">
              {res.bannerImage ? (
                <Image
                  src={res.bannerImage}
                  alt={res.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 dark:from-slate-800 dark:to-slate-900 dark:text-blue-400">
                  <BookOpen className="h-12 w-12 opacity-70" />
                </div>
              )}
            </div>

      
            <div className="p-6 sm:p-8">
        
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {res.subject}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {res.classLevel}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {res.teachingMode}
                </span>
              </div>

           
              <h1 className="mt-2.5 text-2xl font-bold leading-snug tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
                {res.title}
              </h1>

        
              {res.teacher_name && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Mentor: {res.teacher_name}</span>
                </div>
              )}

              
              <div className="mt-6 grid grid-cols-1 gap-4 border-y border-slate-100 py-5 sm:grid-cols-3 dark:border-slate-800">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Monthly Tuition Fee
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    BDT {res.monthlyFee?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Schedule Frequency
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{res.daysPerWeek} days / week</span>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Location / Platform
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="truncate">{res.location}</span>
                  </div>
                </div>
              </div>

         
              <div className="mt-6">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Curriculum & Mentorship Overview
                </h2>
                <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {res.description}
                </p>
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-4">
            <ApplyTuitionCard tuition={res} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;