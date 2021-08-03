import Cookies from "js-cookie";

export default async function fetcher<T>(
  url: string,
  args: Record<string, any> = {},
  req: Record<string, any> = {}
): Promise<T> {
  args = {
    ...args,
    credentials: "include",
    headers: {
      Cookie: req.headers?.cookie,
      "Content-Type": "application/json",
      ...(args?.headers || {}),
    },
  };

  // include data in post
  const data = args["data"];
  if (data) {
    args["body"] = JSON.stringify(data);
    delete args["data"];
  }

  if (["post", "put", "delete"].indexOf(args.method?.toLowerCase()) !== -1) {
    const csrf = Cookies.get("django_csrf");
    args.headers["x-csrftoken"] = csrf;
  }

  const res = await fetch(url, args);
  if (!res.ok) {
    throw res;
  }
  return res.json();
}

/**
 * Tries to parse a server error (serializer error)
 * err: the caught exception (can be a response or Error)
 */
export async function parseFetchErrors(
  err: Response | Error | any,
  context?: any
): Promise<Record<string, any> | null> {
  if (err.status && err.status >= 400 && err.status < 500) {
    // it is indeed a response object
    const res = err;
    const data = await res.json();
    const { ok, ...errors } = data;

    return Object.entries(errors).reduce(
      (acc: any, [name, messages]: [any, string[]]) => {
        acc[name] = {
          type: "server",
          message: Array.isArray(messages) ? messages[0] : messages,
        };
        return acc;
      },
      {} as Record<string, any>
    );
  } else {
    console.log(err);
  }
}
