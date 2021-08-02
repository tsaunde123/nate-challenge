import { API_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { IScrape } from "@/types/scrape";
import useSWR from "swr";

interface IScrapeResponse {
  scrape?: IScrape;
  isLoading: boolean;
  isError: any;
}

export function useScrape(id): IScrapeResponse {
  const { data, error } = useSWR(id && `${API_URL}/scrapes/${id}`, fetcher);

  return {
    scrape: data as IScrape | null,
    isLoading: !error && !data,
    isError: error,
  };
}
