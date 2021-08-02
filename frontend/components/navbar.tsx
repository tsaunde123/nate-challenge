import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Container from "./container";

const navigation = [
  { url: "/", label: "Search" },
  { url: "/scrapes", label: "History" },
];

export default function Navbar() {
  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800 text-white">
        {({ open }) => (
          <>
            <Container>
              <div className="flex items-center justify-between h-20">
                <div className="w-full flex items-center">
                  {/* logo */}
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <a className="font-mono font-bold text-xl hover:text-blue-500">
                        Nate: Challenge
                      </a>
                    </Link>
                  </div>
                  {/* search */}
                  <div className="hidden md:block ml-10 w-full">
                    {navigation.map((item, itemIdx) => (
                      <Link href={item.url} key={item.label}>
                        <a className="hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                          {item.label}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6"></div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-offset-gray-400 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </Container>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item, itemIdx) => (
                  <Link href={item.url} key={item.label}>
                    <a
                      href={item.url}
                      className="hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
