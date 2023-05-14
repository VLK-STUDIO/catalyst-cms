"use client";

import { IconWorld } from "@tabler/icons-react";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  locales: readonly string[];
  defaultLocale: string;
};

export const LocaleSwitch: React.FC<Props> = ({ locales, defaultLocale }) => {
  const pathname = usePathname();
  const params = useSearchParams();

  const currentLocale = params
    ? params.get("locale") || defaultLocale
    : defaultLocale;

  const [show, setShow] = useState(false);

  return (
    <div className="absolute m-16 top-0 right-0 flex flex-col items-end">
      <button className="text-red-600" onClick={() => setShow(!show)}>
        <IconWorld />
      </button>
      <div
        className={clsx(
          "flex-col mt-2 border border-gray-300 rounded",
          show ? "flex" : "hidden"
        )}
      >
        {locales.map((locale) => (
          <a
            key={locale}
            href={pathname + `?locale=${locale}`}
            className={clsx(
              "text-right p-2 bg-white",
              locale === currentLocale
                ? "text-red-600 font-semibold"
                : "text-gray-400"
            )}
          >
            {locale}
          </a>
        ))}
      </div>
    </div>
  );
};
