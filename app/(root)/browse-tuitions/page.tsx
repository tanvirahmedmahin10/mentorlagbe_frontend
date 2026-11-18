import React from "react";
import { FetchGetData } from "@/lib/getApiBackend/getData";
import { TuitionPostPayload } from "@/lib/postApiBackend/postData";
import BrowsingClient from "@/app/Components/BrowsingCard";


interface BrowsingPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const BrowsingPage = async ({ searchParams }: BrowsingPageProps) => {
  const resolvedParams = await searchParams;
  const urlSearch = new URLSearchParams(
    resolvedParams as Record<string, string>
  );
  const query = urlSearch.toString();

  const endpoint = query ? `tuitions?${query}` : "tuitions";
  const data: TuitionPostPayload[] = (await FetchGetData(endpoint)) ?? [];

  return <BrowsingClient initialData={data} />;
};

export default BrowsingPage;