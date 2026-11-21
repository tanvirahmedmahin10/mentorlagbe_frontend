import { baseBackendUrl } from "../postApiBackend/postData"



export const checkoutVerify=async(sessionId:string)=>{

    const res=await fetch(`${baseBackendUrl}/payments/checkout_verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({sessionId}),
  });
  return res.json()
}