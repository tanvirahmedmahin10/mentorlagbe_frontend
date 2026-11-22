import React from "react";
import { FetchGetData } from "@/lib/getApiBackend/getData";
import BrowsingClient from "@/app/Components/BrowsingCard";
import { TuitionPostPayload } from "@/lib/types/type";


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
  const initialData: TuitionPostPayload[] = (await FetchGetData(endpoint)) ?? [];
  const data: TuitionPostPayload[] = initialData.filter(
  (post) =>
    post.status?.toLowerCase() === "approved" &&
    post.availability !== "Closed"
);
  return <BrowsingClient initialData={data} />;
};

export default BrowsingPage;