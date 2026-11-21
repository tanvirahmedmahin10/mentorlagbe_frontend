"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ImagePlus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { protectedMutation } from "@/lib/actions/server";

const baseBackendUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL;
const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  phone?: string;
  academicBio?: string;
  premium?: boolean;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    data: session,
    isPending: sessionLoading,
    refetch,
  } = authClient.useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [academicBio, setAcademicBio] = useState("");

  const sessionUser = session?.user as
    | { id?: string; name?: string; email?: string; role?: string; image?: string }
    | undefined;

  useEffect(() => {
    if (sessionLoading) return;
    if (!sessionUser?.id) {
      router.push("/signin");
      return;
    }

    let ignore = false;

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("bearer_token") || "";
        const res = await fetch(`${baseBackendUrl}/users/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        if (res.ok && !ignore) {
          const data: UserProfile = await res.json();
          setProfile(data);
          setName(data.name || "");
          setPhone(data.phone || "");
          setImage(data.image || "");
          setAcademicBio(data.academicBio || "");
        } else if (!ignore) {
          setName(sessionUser.name || "");
          setImage(sessionUser.image || "");
        }
      } catch {
        if (!ignore) {
          setName(sessionUser.name || "");
          setImage(sessionUser.image || "");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [sessionLoading, sessionUser?.id, sessionUser?.name, sessionUser?.image, router]);

  const role = (profile?.role || sessionUser?.role || "student").toLowerCase();
  const isTutor = role === "tutor";
  const isStudent = role === "student";
  const isAdmin = role === "admin";
  const isPremium = Boolean(profile?.premium);
  const needsTutorBio = isTutor && !profile?.academicBio?.trim();

  const initials = (name || sessionUser?.name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Only PNG and JPG images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    if (!imgbbApiKey) {
      toast.error("ImgBB API key is missing");
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data?.success && data?.data?.display_url) {
        setImage(data.data.display_url);
        toast.success("Photo uploaded! Click Save Profile to apply.");
      } else {
        toast.error("Failed to upload photo to ImgBB");
      }
    } catch {
      toast.error("Photo upload failed");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Full Name is required");
      return;
    }

    if (isTutor && !academicBio.trim()) {
      toast.error("Academic Bio / Teaching Experience is required for tutors");
      return;
    }

    setSaving(true);
    try {
      const result = await protectedMutation(
        `${baseBackendUrl}/users/profile`,
        "PATCH",
        {
          name: name.trim(),
          phone: phone.trim(),
          image: image.trim(),
          ...(!isStudent ? { academicBio: academicBio.trim() } : {}),
        }
      );

      if (!result?.acknowledged && !result?.modifiedCount) {
        toast.error(result?.message || "Failed to update profile");
        return;
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name: name.trim(),
              phone: phone.trim(),
              image: image.trim(),
              academicBio: !isStudent ? academicBio.trim() : prev.academicBio,
            }
          : null
      );

   
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim(),
      });
      await refetch();

      toast.success("Profile updated successfully!");
      router.refresh();

      if (needsTutorBio) {
        router.push("/dashboard/tutor");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
          Update Profile
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          {isStudent
            ? "Update your contact information and profile picture."
            : "Update your contact information, academic bio, and profile picture."}
        </p>
      </div>

      {needsTutorBio && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed">
            <span className="font-semibold">Required for Tutors:</span> Fill out
            your Academic Bio / Teaching Experience below and click{" "}
            <span className="font-semibold">Save Profile</span> to continue to
            your tutor dashboard.
          </p>
        </div>
      )}


      <div className="mb-5 flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 capitalize dark:text-white">
            {isAdmin
              ? "Admin"
              : `${role} • ${isPremium ? "Pro Plan" : "Free Plan"}`}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {isAdmin
              ? "Full platform administration and moderation access."
              : isPremium
              ? "Your Pro subscription privileges are active."
              : "Upgrade anytime on the Pricing page to unlock Pro features."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-7 dark:border-slate-800 dark:bg-slate-900"
      >

        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
          {image ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
              <Image
                src={image}
                alt={name || "Profile"}
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {initials}
            </div>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {uploadingImage ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5 text-slate-500" />
              )}
              <span>
                {uploadingImage
                  ? "Uploading..."
                  : "Upload Profile Photo (ImgBB)"}
              </span>
            </button>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Direct image file upload (PNG, JPG up to 5MB).
            </p>
          </div>
        </div>


        <div className="mt-6 space-y-5">
      
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-600 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

   
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={profile?.email || sessionUser?.email || ""}
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-xs text-slate-500 sm:text-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
            />
          </div>

 
          {!isStudent && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Academic Bio / Teaching Experience {isTutor ? "*" : ""}
              </label>
              <textarea
                rows={4}
                required={isTutor}
                value={academicBio}
                onChange={(e) => setAcademicBio(e.target.value)}
                placeholder="Write your academic qualifications and teaching experience..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-900 outline-none transition focus:border-blue-600 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}


          <div className="pt-1">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{saving ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}