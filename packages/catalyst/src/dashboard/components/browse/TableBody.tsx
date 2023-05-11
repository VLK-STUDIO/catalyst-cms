import { CatalystCollection, CatalystField } from "../../../types";
import { CurrentSubrouteLink } from "../_shared/CurrentSubrouteLink";

type FieldMap<T extends CatalystField<any>> = Record<
  T["type"],
  (doc: any, field: T & { key: string }) => React.ReactNode
>;

const fieldMap = {
  richtext: (doc, field) => (
    <span>{doc[field.key].replace(/<[^>]*>?/gm, "")}</span>
  ),
  select: (doc, field) => {
    const option = field.options.find(
      ({ value }: { value: string }) => value === doc[field.key]
    );
    return <span>{option?.label}</span>;
  },
  text: (doc, field) => <span>{doc[field.key]}</span>,
  reference: (doc, field) => (
    <span>
      {doc[field.key][field.exposedColumn ? field.exposedColumn : "_id"]}
    </span>
  ),
  derived: () => null
} satisfies FieldMap<any>;

type Props = {
  docs: any[];
  collection: CatalystCollection<any> & { name: string };
};

export const TableBody: React.FC<Props> = ({ collection, docs }) => {
  return (
    <tbody>
      {docs.map((doc, index: number) => (
        <tr key={index}>
          {Object.entries(collection.fields).map(([fieldKey, field]) => (
            <td key={fieldKey} className="truncate py-2 text-gray-600">
              {fieldMap[field.type](doc, {
                ...field,
                key: fieldKey
              })}
            </td>
          ))}
          <td className="text-right font-semibold text-red-600">
            <CurrentSubrouteLink
              href={`/edit-collection/${collection.name}/${doc._id}`}
            >
              Edit
            </CurrentSubrouteLink>
          </td>
        </tr>
      ))}
    </tbody>
  );
};
