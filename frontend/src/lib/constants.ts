export const API_BASE_PATH = process.env.API_URL || "http://localhost:8000";

export const ApiRoutes = {
  Time: `${API_BASE_PATH}/api/time`,
  Scraper: `${API_BASE_PATH}/api/scrape`,
  History: `${API_BASE_PATH}/api/history`,
};
