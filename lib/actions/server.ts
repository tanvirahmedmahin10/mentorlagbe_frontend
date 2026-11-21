"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";


export const getSession=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })
    return session
}
export const getToken=async()=>{
    const session=await getSession()
    if(!session||!session.session?.token){
        redirect("/unauthorized")
    }
    return session.session.token
}
export const authFetch=async(api:string)=>{
    const token=await getToken();
    const res=await fetch(api,{
        headers:{
            authorization:`Bearer ${token}`
        }
    })
    return res
}
export const authGet=async(api:string)=>{
    const res=await authFetch(api)
    if(!res.ok){
        return null
    }
    return res.json()
}
export const authPost=async(api:string,body:unknown)=>{
    const token=await getToken();
    const res=await fetch(api,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            authorization:`Bearer ${token}`
        },
        body:JSON.stringify(body)
    })
    return {
        ok:res.ok,
        data:await res.json().catch(()=>null)
    }
}
export const requireRole=async(role:string)=>{
    const session=await getSession()
    if(!session||session?.user.role!==role){
        redirect("/unauthorized")
    }
    return session
}

export const protectedMutation=async(api:string,method:string,data?:unknown)=>{
const token=await getToken()
const res=await fetch(api,{
    method:method,
     headers:{
        "Content-Type": "application/json",
            authorization:`Bearer ${token}`
        },
    body:data?JSON.stringify(data):null
})
return res.json()
}