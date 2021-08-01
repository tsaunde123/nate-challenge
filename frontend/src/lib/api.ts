import { ApiRoutes } from "./constants";
import fetcher from "./fetch";

interface IScraperResult {
  url: string;
  completion_time: string;
  total_occurrences: number;
  word_occurrences: {
    [key: string]: number;
  };
  error: boolean;
}

export async function scrapeUrl(data: {
  url: string;
  sampleSize: number;
}): Promise<IScraperResult> {
  return fetcher(ApiRoutes.Scraper, {
    method: "POST",
    data: {
      ...data,
      sample_size: data.sampleSize,
    },
  });
}
