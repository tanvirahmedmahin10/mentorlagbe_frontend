import { baseBackendUrl } from "../postApiBackend/postData";

export const FetchGetData=async(path:string)=>{

const res=await fetch(`${baseBackendUrl}/${path}`)
return res.json()

}