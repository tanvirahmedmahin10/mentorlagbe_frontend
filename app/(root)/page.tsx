import React from "react";
import { connection } from "next/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, BookOpen } from "lucide-react";
import { FetchGetData } from "@/lib/getApiBackend/getData";
import { getSession } from "@/lib/actions/server";
import { TuitionPostPayload } from "@/lib/types/type";
import HeroSearchForm from "../Components/HeroSearchForm";
import HowItWorksAndSubjects from "../Components/HowItWorksAndSubjects";
import HomePricing from "../Components/HomePricing";
import HomeTestimonials from "../Components/HomeTestimonials";

export default async function HomePage() {
  await connection();
  const [tuitions, session] = await Promise.all([
    FetchGetData("tuitions"),
    getSession(),
  ]);
  const allTuitions: TuitionPostPayload[] = tuitions ?? [];
  const user = session?.user as
    | { id: string; plan?: string; premium?: boolean }
    | undefined;
  const userPlan =
    user?.plan?.toLowerCase() === "pro" || user?.premium
      ? "pro"
      : (user?.plan?.toLowerCase() ?? "free");

  const approvedTuitions = allTuitions
    .filter(
      (post) =>
        post.status?.toLowerCase() === "approved" &&
        (post as TuitionPostPayload & { availability?: string }).availability !==
          "Closed"
    )
    .sort((a, b) => (b._id || "").localeCompare(a._id || ""));

  const featuredTuitions = approvedTuitions.slice(0, 6);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="border-b border-slate-100 bg-white px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14 dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                Smart Tuition &amp; Mentorship Marketplace
              </p>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.12] dark:text-white">
                Find Your Ideal Tutor or Mentorship Batch Today
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base dark:text-slate-400">
                Connect with verified subject specialists across Bangladesh and
                online worldwide. Filter approved batches by class level,
                learning mode, and transparent monthly fee.
              </p>

             
              <HeroSearchForm />

            
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
                <span>Admin-verified tuition listings</span>
                <span>·</span>
                <span>Online &amp; Home batches</span>
                <span>·</span>
                <span>Direct tutor review</span>
              </div>
            </div>


            <div className="lg:col-span-6">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-sm dark:bg-slate-900">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Tutor and student studying together"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-8 border-t border-slate-100 pt-10 sm:grid-cols-4 dark:border-slate-800/80">
            <div>
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                {approvedTuitions.length > 0 ? `${approvedTuitions.length}+` : "12+"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Approved Active Tuitions
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                4+
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Verified Subject Tutors
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                2+
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enrolled Learners
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                5 <span className="text-lg font-medium text-slate-400">/ 5.0</span>
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Average Student Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50/50 px-4 py-14 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
                Featured Approved Tuitions
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest active batches moderated by MentorLagbe admins and ready
                for student enrollment.
              </p>
            </div>

            <Link
              href="/browse-tuitions"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
            >
              <span>View All Tuitions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {featuredTuitions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <BookOpen className="h-10 w-10 text-slate-400" />
              <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                No approved tuitions yet
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Check back soon for newly verified batches.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTuitions.map((tuition) => (
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

                    <h3 className="mt-2 line-clamp-2 text-[17px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {tuition.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {tuition.description}
                    </p>

                    <div className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {tuition.teacher_name}
                    </div>

                    <div className="mb-2 mt-3.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
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
                        href={`/browse-tuitions/${tuition._id}`}
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
      </section>

      <HomePricing
        isSignedIn={Boolean(session?.user)}
        isPro={userPlan === "pro"}
      />

      <HowItWorksAndSubjects tuitions={approvedTuitions} />

      <HomeTestimonials
        approvedCount={approvedTuitions.length}
        tutorCount={
          new Set(approvedTuitions.map((tuition) => tuition.teacher_id)).size
        }
      />
    </div>
  );
}
