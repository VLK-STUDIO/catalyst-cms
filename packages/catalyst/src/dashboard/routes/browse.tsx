import { IconPlus } from "@tabler/icons-react";
import { CurrentSubrouteLink } from "../components/_shared/CurrentSubrouteLink";
import { TableBody } from "../components/browse/TableBody";
import { notFound } from "next/navigation";
import { RouteProps } from "./types";

export async function BrowseRoute({ cms, params, config }: RouteProps) {
  const [_, collectionName] = params;

  const collection = config.collections[collectionName] || notFound();

  const docs = await cms.data[collectionName].findAsUser({
    autopopulate: true
  });

  return (
    <div className="flex h-full flex-col p-16">
      <h1 className="mb-8 text-4xl font-black uppercase text-red-600">
        BROWSE {collection.label}
      </h1>
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-gray-300">
            {Object.entries(collection.fields).map(([key, field]) => (
              <th key={key} className="py-2 text-left font-semibold">
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <TableBody
          docs={docs}
          collection={{ ...collection, name: collectionName }}
        />
      </table>
      <CurrentSubrouteLink
        href={`/create/${collectionName}`}
        className="absolute bottom-0 right-0 m-16 rounded-full bg-red-600 p-4 text-white hover:bg-red-700"
      >
        <IconPlus />
      </CurrentSubrouteLink>
    </div>
  );
}
