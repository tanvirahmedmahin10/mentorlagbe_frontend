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