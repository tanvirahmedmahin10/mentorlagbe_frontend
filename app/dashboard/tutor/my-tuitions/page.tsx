import React from "react";
import {  FetchTeacherData } from "@/lib/getApiBackend/getData";
import MyTuitionsClient, { TutorTuitionItem } from "@/app/Components/TuitionsCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const MyTuitionsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user=session?.user
  const data: TutorTuitionItem[] = (await FetchTeacherData(user?.id, "tuitions")) ?? [];

  return <MyTuitionsClient initialData={data} />;
};

export default MyTuitionsPage;