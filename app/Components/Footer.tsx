import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white dark:border-slate-800/80 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs shadow-blue-600/20">
                <BookOpen className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                MentorLagbe
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Verified subject-wise tuition batches and 1-on-1 academic
              mentorship across Bangladesh and online worldwide.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 fill-current"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/browse-tuitions"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Browse Tuitions
                </Link>
              </li>
              <li>
                <Link
                  href="/payments"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Pro Subscriptions
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Subjects Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Popular Subjects
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/browse-tuitions?subject=Mathematics"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Higher Mathematics
                </Link>
              </li>
              <li>
                <Link
                  href="/browse-tuitions?subject=Physics"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Physics &amp; Mechanics
                </Link>
              </li>
              <li>
                <Link
                  href="/browse-tuitions?subject=Programming"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Programming &amp; CS
                </Link>
              </li>
              <li>
                <Link
                  href="/browse-tuitions?subject=English"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  IELTS Academic
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                <a
                  href="mailto:support@mentorlagbe.com"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  support@mentorlagbe.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>+880 1711-004920</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Road 11, Banani, Dhaka 1213</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider & Copyright */}
        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:flex sm:items-center sm:justify-between sm:text-left dark:border-slate-800/80 dark:text-slate-500">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Built for students &amp; verified educators.</p>
        </div>
      </div>
    </footer>
  );
}