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
  exposedFields: [string, CatalystField<any>][];
  collectionName: string;
};

export const TableBody: React.FC<Props> = ({
  exposedFields,
  docs,
  collectionName
}) => {
  return (
    <tbody>
      {docs.map((doc, index: number) => (
        <tr key={index}>
          {exposedFields.length > 0 ? (
            exposedFields.map(([fieldKey, field]) => {
              return (
                <td key={fieldKey} className="py-2 text-gray-600">
                  {fieldMap[field.type](doc, {
                    ...field,
                    key: fieldKey
                  })}
                </td>
              );
            })
          ) : (
            <td className="py-2 text-gray-600">{doc._id}</td>
          )}
          <td className="text-right font-semibold text-red-600">
            <CurrentSubrouteLink
              href={`/edit-collection/${collectionName}/${doc._id}`}
            >
              Edit
            </CurrentSubrouteLink>
          </td>
        </tr>
      ))}
    </tbody>
  );
};
