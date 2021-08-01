import fetcher from "./fetch";

export const API_BASE_PATH = process.env.API_URL || "http://localhost:8000";

export const ApiRoutes = {
  Time: `${API_BASE_PATH}/api/time`,
  Scraper: `${API_BASE_PATH}/api/scrape`,
  Searches: `${API_BASE_PATH}/api/searches`,
};

export async function scrapeUrl(data: {
  url: string;
  sampleSize: number;
}): Promise<any> {
  return fetcher(ApiRoutes.Scraper, {
    method: "POST",
    data: {
      ...data,
      sample_size: data.sampleSize,
    },
  });
}
