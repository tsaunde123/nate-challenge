import useSWR from "swr";
import { ApiRoutes } from "./api";
import fetcher from "./fetch";

export function useHistory() {
  const {
    data: pastSearches,
    error,
    mutate,
  } = useSWR(ApiRoutes.Searches, fetcher);
  return { history: pastSearches?.urls || [], error, mutate };
}
