import { IconPlus } from "@tabler/icons-react";
import { CurrentSubrouteLink } from "../components/CurrentSubrouteLink";
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
    <div className="flex flex-col p-16 h-full">
      <h1 className="text-red-600 font-black text-4xl mb-8 uppercase">
        BROWSE {collection.label}
      </h1>
      <table>
        <thead>
          <tr className="border-b border-gray-300">
            {Object.entries(collection.fields).map(([key, field]) => (
              <th key={key} className="text-left py-2 font-semibold">
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
        className="absolute right-0 bottom-0 m-16 bg-red-600 text-white p-4 rounded-full hover:bg-red-700"
      >
        <IconPlus />
      </CurrentSubrouteLink>
    </div>
  );
}
