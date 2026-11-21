import { baseBackendUrl } from "../postApiBackend/postData"

export const getUserPremiumById=async(userId:string)=>{
    
    const res=await fetch(`${baseBackendUrl}/users/${userId}/premium`)
    return res.json()
}