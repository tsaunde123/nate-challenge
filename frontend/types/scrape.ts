export interface IScrape {
  id: number;
  url: string;
  words: any; // TODO add typing
  created_at: string;
  completed_at?: string;
  error: boolean;
}

export interface IWordCount {
  id: number;
  scrape?: any;
  word: string;
  count: number;
}
