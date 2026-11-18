export const baseBackendUrl=process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL

export type TeachingMode = "Online" | "Offline" | "Hybrid";

export interface TuitionPostPayload {
  _id:string,
  title: string;
  subject: string;
  classLevel: string;
  teachingMode: TeachingMode;
  monthlyFee: number;
  daysPerWeek: number;
  location: string;
  bannerImage: string;
  description: string;
  teacher_name: string,
  teacher_email: string
}
export interface TuitionPostPayloadUpdate {
  title: string;
  subject: string;
  classLevel: string;
  teachingMode: TeachingMode;
  monthlyFee: number;
  daysPerWeek: number;
  location: string;
  bannerImage: string;
  description: string;
}

export const FetchPostData=async(data:TuitionPostPayloadUpdate,path:string)=>{
const res = await fetch(`${baseBackendUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res
}
