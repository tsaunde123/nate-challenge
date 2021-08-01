import useSWR from "swr";
import { ApiRoutes } from "./constants";
import fetcher from "./fetch";

interface IHistoryType {
  urls: Array<string>;
}

export function useHistory() {
  const { data, error, mutate } = useSWR<IHistoryType>(
    ApiRoutes.Searches,
    fetcher
  );
  return { history: data?.urls || [], error, mutate };
}
