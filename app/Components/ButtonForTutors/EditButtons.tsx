"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { TutorTuitionItem } from "../TuitionsCard";
import {
  baseBackendUrl,
  TeachingMode,
  TuitionPostPayloadUpdate,
} from "@/lib/postApiBackend/postData";

interface EditButtonsProps {
  tuition: TutorTuitionItem;
  onUpdated?: (updatedTuition: TutorTuitionItem) => void;
}

export default function EditButtons({ tuition, onUpdated }: EditButtonsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(tuition.title);
  const [subject, setSubject] = useState(tuition.subject);
  const [classLevel, setClassLevel] = useState(tuition.classLevel);
  const [teachingMode, setTeachingMode] = useState<TeachingMode>(
    tuition.teachingMode
  );
  const [monthlyFee, setMonthlyFee] = useState<number>(tuition.monthlyFee);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(tuition.daysPerWeek);
  const [location, setLocation] = useState(tuition.location);
  const [bannerImage, setBannerImage] = useState(tuition.bannerImage ?? "");
  const [description, setDescription] = useState(tuition.description);

  const handleOpenModal = () => {
    setTitle(tuition.title);
    setSubject(tuition.subject);
    setClassLevel(tuition.classLevel);
    setTeachingMode(tuition.teachingMode);
    setMonthlyFee(tuition.monthlyFee);
    setDaysPerWeek(tuition.daysPerWeek);
    setLocation(tuition.location);
    setBannerImage(tuition.bannerImage ?? "");
    setDescription(tuition.description);
    setIsOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const updatedPayload: TuitionPostPayloadUpdate = {
      title: title.trim(),
      subject,
      classLevel,
      teachingMode,
      monthlyFee: Number(monthlyFee),
      daysPerWeek: Number(daysPerWeek),
      location: location.trim(),
      bannerImage: bannerImage.trim(),
      description: description.trim(),
    };

    try {
      const res = await fetch(`${baseBackendUrl}/tuitions/${tuition._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        toast.error(errData?.message || "Failed to update tuition");
        return;
      }

      toast.success("Tuition updated successfully!");
      onUpdated?.({ ...tuition, ...updatedPayload });
      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        title="Edit Tuition"
        onClick={handleOpenModal}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 text-left backdrop-blur-xs"
          onClick={() => !loading && setIsOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
         
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Tuition Batch
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your tuition details and save changes.
                </p>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

        
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tuition Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
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
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Class Level *
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
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
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Teaching Mode *
                  </label>
                  <select
                    value={teachingMode}
                    onChange={(e) =>
                      setTeachingMode(e.target.value as TeachingMode)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Monthly Fee (BDT) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Days / Week *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    required
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Location / Platform *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="https://i.ibb.co/..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Curriculum & Batch Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-70"
                >
                  {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}