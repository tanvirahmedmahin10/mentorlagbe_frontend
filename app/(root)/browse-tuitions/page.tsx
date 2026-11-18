import React from "react";
import { FetchGetData } from "@/lib/getApiBackend/getData";

import BrowsingClient from "@/app/Components/BrowsingCard";
import { TuitionPostPayload } from "@/lib/postApiBackend/postData";


const BrowsingPage = async () => {
  const data: TuitionPostPayload[] = (await FetchGetData("tuitions")) ?? [];

  return <BrowsingClient initialData={data} />;
};

export default BrowsingPage;