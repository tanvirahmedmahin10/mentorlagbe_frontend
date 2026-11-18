"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { FetchPostData } from "@/lib/postApiBackend/postData";
import { authClient } from "@/lib/auth-client";

type TeachingMode = "Online" | "Offline" | "Hybrid";

interface ImgBBResponse {
  success: boolean;
  data?: {
    display_url: string;
  };
}

export default function PostTuitionPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("Online");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setBannerFile(selectedFile);

    if (!selectedFile) {
      setBannerUrl("");
      return;
    }

    setUploadingImg(true);
    try {
      const formdata = new FormData();
      formdata.append("image", selectedFile);

      const imgBbEndpoint = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_APP_KEY}`;
      const res = await fetch(imgBbEndpoint, {
        method: "POST",
        body: formdata,
      });

      const data: ImgBBResponse = await res.json();

      if (!data.success || !data.data?.display_url) {
        toast.error("Failed to upload banner image");
        setBannerFile(null);
        setBannerUrl("");
        return;
      }

      setBannerUrl(data.data.display_url);
      toast.success("Banner image uploaded!");
    } catch {
      toast.error("Error uploading image");
      setBannerFile(null);
      setBannerUrl("");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const tuitionData = {
      title: String(formData.get("title") ?? "").trim(),
      subject: String(formData.get("subject") ?? ""),
      classLevel: String(formData.get("classLevel") ?? ""),
      teachingMode,
      monthlyFee: Number(formData.get("monthlyFee") ?? 0),
      daysPerWeek: Number(formData.get("daysPerWeek") ?? 3),
      location: String(formData.get("location") ?? "").trim(),
      bannerImage: bannerUrl,
      description: String(formData.get("description") ?? "").trim(),
      teacher_name:user?.name,
      teacher_email:user?.email
    };

    try {
      const res = await FetchPostData(tuitionData, "tuitions");
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        toast.error(errData?.message || "Failed to publish tuition batch");
        return;
      }

      toast.success("Tuition batch submitted for Admin review!");
      form.reset();
      setBannerFile(null);
      setBannerUrl("");
      router.push("/dashboard/tutor/my-tuitions");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px] dark:text-white">
          Post a Tuition Batch
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          New listings enter Admin review before appearing on the public Browse Tuitions directory.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Tuition Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. HSC Higher Mathematics & Calculus Intensive"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                defaultValue="Programming"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-blue-500"
              >
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

            <div>
              <label
                htmlFor="classLevel"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Class Level <span className="text-red-500">*</span>
              </label>
              <select
                id="classLevel"
                name="classLevel"
                defaultValue="HSC / Class 11-12"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-blue-500"
              >
                <option value="Class 6-8">Class 6-8</option>
                <option value="SSC / Class 9-10">SSC / Class 9-10</option>
                <option value="HSC / Class 11-12">HSC / Class 11-12</option>
                <option value="University Admission">University Admission</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Skill Development">Skill Development</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="teachingMode"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Teaching Mode <span className="text-red-500">*</span>
              </label>
              <select
                id="teachingMode"
                name="teachingMode"
                value={teachingMode}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setTeachingMode(e.target.value as TeachingMode)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-blue-500"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="monthlyFee"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Monthly Fee (BDT) <span className="text-red-500">*</span>
              </label>
              <input
                id="monthlyFee"
                name="monthlyFee"
                type="number"
                min={0}
                required
                defaultValue={3500}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="daysPerWeek"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Days / Week <span className="text-red-500">*</span>
              </label>
              <input
                id="daysPerWeek"
                name="daysPerWeek"
                type="number"
                min={1}
                max={7}
                required
                defaultValue={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Location / Platform <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder={
                  teachingMode === "Online"
                    ? "Zoom / Google Meet"
                    : teachingMode === "Offline"
                    ? "e.g. Dhanmondi, Dhaka"
                    : "e.g. Uttara + Zoom"
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Banner Image File Upload (ImgBB)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="bannerFile"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-blue-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700/70"
              >
                {uploadingImg ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span>Choose Banner File</span>
                  </>
                )}

                <input
                  id="bannerFile"
                  name="bannerFile"
                  type="file"
                  accept="image/*"
                  disabled={uploadingImg}
                  onChange={handleBannerUpload}
                  className="sr-only"
                />
              </label>

              {bannerFile && !uploadingImg && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="max-w-[240px] truncate">{bannerFile.name}</span>
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Curriculum & Batch Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Describe topics covered, class format, assessment schedule, and prerequisites..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={uploadingImg || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                "Publish Tuition Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}