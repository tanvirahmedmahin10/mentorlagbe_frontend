import React from "react";
import { Star, Users, GraduationCap, BookOpen } from "lucide-react";

interface HomeTestimonialsProps {
  approvedCount: number;
  tutorCount: number;
}

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "HSC Student",
    quote:
      "I found an Online Higher Mathematics batch within a day and tracked every application status right from my dashboard.",
  },
  {
    name: "Rafiul Hasan",
    role: "Student, University Admission",
    quote:
      "The filters made it easy to compare class level, teaching mode and monthly fee before applying to a mentor.",
  },
  {
    name: "Tanjila Akter",
    role: "Verified Tutor",
    quote:
      "Posting a batch takes two minutes, and I can accept or reject applicants without leaving the tutor dashboard.",
  },
];

export default function HomeTestimonials({
  approvedCount,
  tutorCount,
}: HomeTestimonialsProps) {
  const stats = [
    {
      label: "Active Tuitions",
      value: approvedCount.toLocaleString(),
      icon: BookOpen,
    },
    {
      label: "Verified Tutors",
      value: `${tutorCount}+`,
      icon: GraduationCap,
    },
    {
      label: "Students Guided",
      value: "2,400+",
      icon: Users,
    },
  ];

  return (
    <section className="bg-slate-50/50 px-4 py-14 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            What students &amp; tutors say
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Real feedback from the MentorLagbe community.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure
                key={item.name}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>

                <figcaption className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {item.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
