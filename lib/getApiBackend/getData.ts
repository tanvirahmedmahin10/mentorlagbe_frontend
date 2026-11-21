import { baseBackendUrl } from "../postApiBackend/postData";

export const FetchGetData=async(path:string)=>{

const res=await fetch(`${baseBackendUrl}/${path}`)
return res.json()

}
export const FetchTeacherData = async (teacherId?: string, path: string = "tuitions") => {
  if (!teacherId) return [];

  const res = await fetch(`${baseBackendUrl}/${path}?teacher_id=${encodeURIComponent(teacherId)}`, {
    cache: "no-store", 
  });

  if (!res.ok) return [];
  return res.json();
};
export const FetchGetDetails=async(id:string)=>{

const res=await fetch(`${baseBackendUrl}/tuitions/${id}`)
return res.json()

}
export const FetchStudentData = async (studentId?: string, path: string = "applications") => {
  if (!studentId) return [];

  const res = await fetch(`${baseBackendUrl}/${path}?student_id=${encodeURIComponent(studentId)}`, {
    cache: "no-store", 
  });

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