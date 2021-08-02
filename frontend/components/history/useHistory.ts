import { API_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { IScrape } from "@/types/scrape";
import useSWR from "swr";

interface IHistoryResponse {
  history?: IScrape[];
  isLoading: boolean;
  isError: any;
}

export function useHistory(): IHistoryResponse {
  const { data, error } = useSWR(`${API_URL}/scrapes`, fetcher);
  return {
    history: data as IScrape[] | null,
    isLoading: !error && !data,
    isError: error,
  };
}
