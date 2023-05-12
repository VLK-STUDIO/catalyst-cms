import { CatalystField } from "../../../types";

type Props = {
  exposedFields: [string, CatalystField<any>][];
};

export const TableHead: React.FC<Props> = ({ exposedFields }) => {
  return (
    <thead>
      <tr className="border-b border-gray-300">
        {exposedFields.length > 0 ? (
          exposedFields.map(([key, field]) => (
            <th key={key} className="py-2 text-left font-semibold">
              {field.label}
            </th>
          ))
        ) : (
          <th className="py-2 text-left font-semibold">ID</th>
        )}
      </tr>
    </thead>
  );
};
