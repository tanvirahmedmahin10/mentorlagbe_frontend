import { getToken } from "../actions/server";
import { TuitionApplicationPayload, TuitionPostPayloadUpdate } from "../types/type";

export const baseBackendUrl=process.env.NEXT_PUBLIC_BETTER_AUTH_BACKEND_URL


export const FetchPostData = async (
  data: TuitionPostPayloadUpdate,
  path: string
) => {
  const token = await getToken();

  const res = await fetch(`${baseBackendUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  return res;
};
export const FetchPostApplyData=async(data:TuitionApplicationPayload,path:string)=>{
const res = await fetch(`${baseBackendUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res
}

