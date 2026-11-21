export type TeachingMode = "Online" | "Offline" | "Hybrid";
export type ApplicationStatus = "pending" | "accepted" | "rejected";


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
  teacher_email: string,
  teacher_id:string,
  status:string,
  teacherBio?: string;
  teacherImage?: string;
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
export interface TuitionApplicationPayload {
    _id?: string;
  tuition_id: string;
  tuition_title: string;
  subject: string;
  classLevel: string;
  teachingMode: TeachingMode | string;
  monthlyFee: number;
  teacher_id?: string;
  teacher_name?: string;
  teacher_email?: string;
  student_id: string;
  student_name: string;
  student_email: string;
  preferredSchedule: string;
  contactNumber: string;
  note: string;
  status: ApplicationStatus;
}
export interface TuitionApplicationType {
  _id: string;
  tuition_id: string;
  tuition_title: string;
  subject: string;
  classLevel: string;
  teachingMode: "Online" | "Offline" | "Hybrid";
  monthlyFee: number;
  teacher_id?: string;
  teacher_name: string;
  teacher_email: string;
  student_id: string;
  student_name: string;
  student_email: string;
  preferredSchedule: string;
  contactNumber: string;
  note?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt?: string;
}
