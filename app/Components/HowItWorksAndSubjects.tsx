
import Link from "next/link";
import {
  Sigma,
  Atom,
  Code2,
  BookOpen,
  FlaskConical,
  Dna,
} from "lucide-react";
import { TuitionPostPayload } from "@/lib/types/type";

interface HowItWorksAndSubjectsProps {
  tuitions?: TuitionPostPayload[];
}

const WORKFLOW_STEPS = [
  {
    step: "01.",
    title: "Register Your Role",
    description:
      "Create a free Student or Tutor account with secure session protection and customizable profile credentials.",
  },
  {
    step: "02.",
    title: "Publish or Discover Batches",
    description:
      "Tutors publish subject-wise batches with banner photography; admins moderate every post before it goes live.",
  },
  {
    step: "03.",
    title: "Apply & Manage Enrollments",
    description:
      "Students filter approved tuitions by class level, mode, and fee, apply in one form, and track status live.",
  },
  {
    step: "04.",
    title: "Scale with Pro Membership",
    description:
      "Upgrade via Stripe Checkout for unlimited tutor batch postings, verified tutor badges, and priority student booking.",
  },
];

const SUBJECT_CATEGORIES = [
  {
    name: "Mathematics",
    subtitle: "HSC, O-Level, SAT & Calculus",
    icon: Sigma,
  },
  {
    name: "Physics",
    subtitle: "Mechanics, Waves & Admission",
    icon: Atom,
  },
  {
    name: "Programming",
    subtitle: "TypeScript, React, DSA & Python",
    icon: Code2,
  },
  {
    name: "IELTS",
    subtitle: "Band 7.5+ Writing & Speaking",
    icon: BookOpen,
  },
  {
    name: "Chemistry",
    subtitle: "Organic & Medical Prep",
    icon: FlaskConical,
  },
  {
    name: "Biology",
    subtitle: "Genetics & Physiology Batches",
    icon: Dna,
  },
];

export default function HowItWorksAndSubjects({
  tuitions = [],
}: HowItWorksAndSubjectsProps) {
  const getSubjectCount = (subjectName: string) =>
    tuitions.filter(
      (item) =>
        item.subject?.toLowerCase().trim() === subjectName.toLowerCase().trim()
    ).length;

  return (
    <>
      <section id="how-it-works" className="border-t border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
              How MentorLagbe Works
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              A transparent, role-based workflow uniting students, specialist
              tutors, and platform moderators.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="border-t border-slate-200/80 pt-5 dark:border-slate-800"
              >
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {item.step}
                </span>
                <h3 className="mt-2.5 text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50/40 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
              Explore by Academic Subject
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Jump directly into curated batches across board curricula,
              university admission, and tech skills.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECT_CATEGORIES.map((subject) => {
              const Icon = subject.icon;
              const activeCount = getSubjectCount(subject.name);

              return (
                <Link
                  key={subject.name}
                  href={`/browse-tuitions?subject=${encodeURIComponent(
                    subject.name
                  )}`}
                  className="group flex items-start justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {subject.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {subject.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {activeCount} active
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
