export default async function fetcher<T>(
  url: string,
  args: Record<string, any> = {}
): Promise<T> {
  args = {
    ...args,
    headers: { "Content-Type": "application/json" },
  };

  // include data in post
  const data = args["data"];
  if (data) {
    args["body"] = JSON.stringify(data);
    delete args["data"];
  }

  const res = await fetch(url, args);
  if (!res.ok) {
    throw res;
  }
  return res.json();
}
