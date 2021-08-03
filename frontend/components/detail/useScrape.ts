import { API_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { IScrape } from "@/types/scrape";
import useSWR from "swr";

// TODO get these options from the backend rather than hard-coding
export enum Sort {
  WordASC = "word-asc",
  WordDESC = "word-desc",
  CountASC = "count-asc",
  CountDESC = "count-desc",
}

interface IScrapeResponse {
  scrape?: IScrape;
  isLoading: boolean;
  isError: any;
}

export function useScrape(id: number, sortFn: Sort): IScrapeResponse {
  const { data, error } = useSWR(
    id && `${API_URL}/scrapes/${id}?sort=${sortFn}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  ); // refresh every 5 seconds

  return {
    scrape: data as IScrape | null,
    isLoading: !error && !data,
    isError: error,
  };
}
