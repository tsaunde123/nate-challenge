import { useRouter } from "next/router";
import { Sort, useScrape } from "./useScrape";
import cx from "classnames";
import { IScrape } from "@/types/scrape";
import { useState } from "react";

function Status(scrape: IScrape) {
  return (
    <span
      className={cx(
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full mb-1",
        {
          "bg-green-100 text-green-800": !!scrape.completed_at && !scrape.error,
          "bg-yellow-100 text-yellow-800":
            !scrape.completed_at && !scrape.error,
          "bg-red-100 text-red-800": scrape.error,
        }
      )}
    >
      {scrape.error ? "Error" : scrape.completed_at ? "Succeeded" : "Pending"}
    </span>
  );
}

function Words(scrape: IScrape) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block  sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Word
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {((scrape.words as []) || []).map((wordcount: any, id) => (
                  <tr key={id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {wordcount.word}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cx(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        )}
                      >
                        {wordcount.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailView() {
  const {
    query: { id },
  } = useRouter();
  const [sortFn, setSortFn] = useState(Sort.CountDESC);
  const { scrape, isLoading, isError } = useScrape(id, sortFn);

  function changeSortFn(e) {
    e.preventDefault();
    setSortFn(e.target.value);
  }

  return (
    <div className="mt-4">
      <h1 className="text-2xl text-center font-medium mb-2">Detail</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Could not fetch</p>
      ) : (
        <>
          <h2 className="text-xl text-gray-700 mb-1">{`${scrape.url}: `}</h2>
          <div className="flex items-center space-x-10 mb-2">
            <div>
              <Status {...scrape} />
            </div>
            <select
              name="sort"
              id="sort"
              className="text-sm mt-1 block rounded-md"
              value={sortFn}
              onChange={changeSortFn}
            >
              <option value={Sort.WordASC}>Word ASC</option>
              <option value={Sort.WordDESC}>Word DESC</option>
              <option value={Sort.CountASC}>Count ASC</option>
              <option value={Sort.CountDESC}>Count DESC</option>
            </select>
          </div>
          <Words {...scrape} />
          {!scrape.completed_at && <p className="mt-1">Processing...</p>}
        </>
      )}
    </div>
  );
}
