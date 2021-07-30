export default async function fetcher(
  url: string,
  args: Record<string, any> = {}
) {
  const res = await fetch(url, args);
  if (!res.ok) {
    throw res;
  }
  return res.json();
  //   return fetch(...args).then((res) => res.json());
}
