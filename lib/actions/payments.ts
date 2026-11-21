import { baseBackendUrl } from "../postApiBackend/postData"
import { protectedMutation } from "./server";



export const checkoutVerify = async (sessionId: string) => {
  return protectedMutation(
    `${baseBackendUrl}/payments/checkout_verify`,
    "POST",
    { sessionId }
  );
};