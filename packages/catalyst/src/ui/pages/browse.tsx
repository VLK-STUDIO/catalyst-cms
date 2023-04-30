import { IconPlus } from "@tabler/icons-react";
import { CatalystConfig, CatalystCollection } from "../../types";
import { CurrentSubrouteLink } from "../components/CurrentSubrouteLink";
import { CatalystDataObject } from "../../data/types";

type Props<C extends CatalystConfig> = {
  collection: CatalystCollection & { name: string };
  data: CatalystDataObject<C>;
};

export async function BrowsePage<C extends CatalystConfig>(props: Props<C>) {
  const docs = await props.data[props.collection.name].findAsUser();

  return (
    <div className="flex flex-col p-16 bg-gray-100 h-full">
      <h1 className="text-red-600 font-black text-4xl mb-8 uppercase">
        BROWSE {props.collection.label}
      </h1>
      <table>
        <thead>
          <tr className="border-b border-gray-300">
            {Object.entries(props.collection.fields).map(([key, field]) => (
              <th key={key} className="text-left py-2 font-semibold">
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docs.map((doc: any, index: number) => (
            <tr key={index}>
              {Object.entries(props.collection.fields).map(
                ([fieldKey, field]) => (
                  <td key={fieldKey} className="py-2 text-gray-600">
                    {field.type === "richtext" ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: doc[fieldKey] }}
                      />
                    ) : field.type === "reference" ? (
                      doc[fieldKey][
                        field.exposedColumn ? field.exposedColumn : "_id"
                      ]
                    ) : (
                      doc[fieldKey]
                    )}
                  </td>
                )
              )}
              <td className="text-red-600 font-semibold text-right">
                <CurrentSubrouteLink
                  href={`/edit/${props.collection.name}/${doc._id}`}
                >
                  Edit
                </CurrentSubrouteLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CurrentSubrouteLink
        href={`/create/${props.collection.name}`}
        className="absolute right-0 bottom-0 m-16 bg-red-600 text-white p-4 rounded-full hover:bg-red-700"
      >
        <IconPlus />
      </CurrentSubrouteLink>
    </div>
  );
}
