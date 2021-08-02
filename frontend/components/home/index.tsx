import { API_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { IScrape } from "@/types/scrape";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

export default function HomeView() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    try {
      const resp = await (fetcher(`${API_URL}/scrapes/`, {
        method: "POST",
        data: { url: input },
      }) as Promise<IScrape>);
      router.push(`/scrapes/${resp.id}`);
    } catch (err) {
      console.log(err);
      // TODO: handle error
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="URL"
          className="text-2xl mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </>
  );
}
