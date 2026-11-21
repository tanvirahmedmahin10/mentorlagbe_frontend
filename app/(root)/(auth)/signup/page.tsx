"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Users,
  User,
  Mail,
  Upload,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type UserRole = "student" | "tutor";

interface ImgBBResponse {
  success: boolean;
  data?: {
    display_url: string;
  };
}

type SignUpPayload = Parameters<typeof authClient.signUp.email>[0] & {
  role: UserRole;
};

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (!selectedFile) {
      setImageUrl(undefined);
      return;
    }

    setUploadingImg(true);
    const formdata = new FormData();
    formdata.append("image", selectedFile);

    const imgBbEndpoint = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_APP_KEY}`;
    const res = await fetch(imgBbEndpoint, {
      method: "POST",
      body: formdata,
    });

    const data: ImgBBResponse = await res.json();
    setUploadingImg(false);

    if (!data.success || !data.data?.display_url) {
      toast.error("Failed to upload profile photo");
      setFile(null);
      setImageUrl(undefined);
      return;
    }

    setImageUrl(data.data.display_url);
    toast.success("Photo uploaded!");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("fullName") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const payload: SignUpPayload = {
      name,
      email,
      password,
      image: imageUrl,
      role,
    };

    const { error } = await authClient.signUp.email(payload);

    if (error) {
      setLoading(false);
      toast.error(error.message || "Failed to create account");
      return;
    }

    toast.success("Account created successfully!");
    if (role === "tutor") {
      router.push("/myprofile");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-50/70 px-4 py-12 transition-colors dark:bg-slate-950">
      <div className="w-full max-w-115 rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm sm:p-9 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Choose your role to get started on MentorLagbe for free.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
       
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  role === "student"
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/30 dark:ring-blue-500"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    role === "student"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Student</span>
                </div>
                <span
                  className={`mt-1 text-xs ${
                    role === "student"
                      ? "text-blue-600/80 dark:text-blue-400/80"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  Find & apply to batches
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("tutor")}
                className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                  role === "tutor"
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/30 dark:ring-blue-500"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    role === "tutor"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Tutor</span>
                </div>
                <span
                  className={`mt-1 text-xs ${
                    role === "tutor"
                      ? "text-blue-600/80 dark:text-blue-400/80"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  Post tuitions & teach
                </span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="e.g. Ayesha Siddiqua"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="photo"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Profile Photo
            </label>
            <label
              htmlFor="photo"
              className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-3.5 py-2.5 transition-colors hover:border-blue-500 hover:bg-blue-50/30 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-blue-500 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  {uploadingImg ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </div>
                <div className="truncate">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {uploadingImg
                      ? "Uploading photo..."
                      : file
                      ? file.name
                      : "Choose a photo from your PC"}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    PNG, JPG or WEBP (max. 2MB)
                  </p>
                </div>
              </div>

              <span className="ml-2 shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                Browse
              </span>

              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                disabled={uploadingImg}
                onChange={handleImgUpload}
                className="sr-only"
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Password (minimum 6 characters)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImg}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}