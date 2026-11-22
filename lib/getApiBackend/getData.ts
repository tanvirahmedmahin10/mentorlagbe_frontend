import { authFetch } from "../actions/server";
import { baseBackendUrl } from "../postApiBackend/postData";

export const FetchGetData=async(path:string)=>{
  try {
    const res = await fetch(`${baseBackendUrl}/${path}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return [];
    }

    const data: unknown = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }

}
export const FetchTeacherData = async (teacherId?: string, path: string = "tuitions") => {
  if (!teacherId) return [];

  const api = `${baseBackendUrl}/${path}?teacher_id=${encodeURIComponent(teacherId)}`;
  const res =
    path === "applications"
      ? await authFetch(api)
      : await fetch(api, { cache: "no-store" });

  if (!res.ok) return [];
  return res.json();
};
export const FetchGetDetails = async (id: string) => {
  try {
    const res = await fetch(`${baseBackendUrl}/tuitions/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
  } catch {
    return null;
  }
};
export const FetchStudentData = async (studentId?: string, path: string = "applications") => {
  if (!studentId) return [];
const api=`${baseBackendUrl}/${path}?student_id=${encodeURIComponent(studentId)}`
  const res = await authFetch(api)

  if (!res.ok) return [];
  return res.json();
};
export const FetchStudentDataCount = async (studentId?: string, path: string = "applications") => {
  if (!studentId) return [];

  const res = await fetch(`${baseBackendUrl}/${path}/count?student_id=${encodeURIComponent(studentId)}`, {
    cache: "no-store", 
  });

  if (!res.ok) return [];
  return res.json();
};
export const FetchTeacherDataCount = async (
  teacherId?: string,
  path: string = "tuitions"
) => {
  if (!teacherId) return { count: 0 };

  const res = await fetch(
    `${baseBackendUrl}/${path}/count?teacher_id=${encodeURIComponent(teacherId)}`,
    { cache: "no-store" }
  );

  if (!res.ok) return { count: 0 };
  return res.json();
};
