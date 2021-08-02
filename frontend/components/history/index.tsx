import { IScrape } from "@/types/scrape";
import cx from "classnames";
import Link from "next/link";
import { useHistory } from "./useHistory";

export default function HistoryView() {
  const { history, isLoading } = useHistory();
  const hasRows = Boolean(history && history.length);
  return (
    <div className="mt-4">
      <h1 className="text-2xl text-center font-medium mb-2">History</h1>
      {isLoading && "Loading"}
      {!hasRows && !isLoading && (
        <div className="text-xl text-gray-700">
          Nothing to show here.
          <br />
          Start by{" "}
          <Link href="/">
            <a className="text-blue-700">querying a url first</a>
          </Link>
        </div>
      )}
      {hasRows && !isLoading && (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        URL
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {((history as []) || []).map((row: IScrape, id) => (
                      <tr key={id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {row.url}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cx(
                              "px-2 inline-flex text-xs leading-5 font-semibold rounded-full ",
                              {
                                "bg-green-100 text-green-800":
                                  !!row.completed_at && !row.error,
                                "bg-yellow-100 text-yellow-800":
                                  !row.completed_at && !row.error,
                                "bg-red-100 text-red-800": row.error,
                              }
                            )}
                          >
                            {row.error
                              ? "Error"
                              : row.completed_at
                              ? "Succeeded"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/scrapes/${row.id}`}>
                            <a className="text-indigo-600 hover:text-indigo-900">
                              View
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
