"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Moon, Sun, Menu, X, User, LogOut } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { Avatar } from "@base-ui/react/avatar";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";


export default function Navbar() {
  

  const pathname = usePathname();
  const router = useRouter();

  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
 const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Tuitions", href: "/browse-tuitions" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/how-it-works" },
  ...(user?.role
    ? [{ name: "Dashboard", href: `/dashboard/${user.role}` }]
    : []),
];
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setPopoverOpen(false);
  };

  const handleSignOut = async () => {
    closeMenus();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.error("You Logged Out");
          router.push("/signin");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20 transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            MentorLagbe
          </span>
        </Link>

      
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 text-[15px] font-medium transition-colors ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

       
        <div className="flex items-center gap-3">
        
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          ) : user ? (
            <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
              <Popover.Trigger
                aria-label="Open profile menu"
                className="flex items-center justify-center rounded-full ring-2 ring-transparent transition hover:ring-blue-600/30 focus:outline-none"
              >
                <Avatar.Root className="inline-flex h-9 w-9 select-none items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {user.image && (
                    <Avatar.Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-blue-600 text-white">
                    {user.name?.slice(0, 2).toUpperCase() || "U"}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Positioner sideOffset={10} align="end" className="z-50">
                  <Popover.Popup className="w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    
                    <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/myprofile"
                        onClick={closeMenus}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        My Profile
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          ) : (
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/signin"
                className="text-[15px] font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}


          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Dark Mode"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-6 pt-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenus}
                  className={`rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {!user && !isPending && (
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Link
                href="/signin"
                onClick={closeMenus}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={closeMenus}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}