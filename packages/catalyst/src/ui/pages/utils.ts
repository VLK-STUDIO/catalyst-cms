import { CatalystDataType } from "../../types";
import { FormField } from "../components/form/types";
import mongoClientPromise from "../../mongo";
import { convertObjectIdsToString } from "../../utils";

export function getFormFieldsFromDataType(
  dataType: CatalystDataType<any>,
  data: Record<string, any> = {}
): Promise<FormField[]> {
  return Promise.all(
    Object.entries(dataType.fields).map(async ([key, field]) => {
      const { type, label } = field;

      switch (type) {
        case "text":
          return {
            type,
            name: key,
            label,
            value: data[key] || ""
          };
        case "richtext":
          return {
            type,
            name: key,
            label,
            value: data[key] || ""
          };
        case "select":
          return {
            type,
            name: key,
            label,
            value: data[key] || field.options[0].value,
            options: field.options
          };
        case "reference":
          const { collection: refCollection } = field;

          const exposedColumn = field.exposedColumn || "_id";

          const client = await mongoClientPromise;

          const refCollectionData = await client
            .db()
            .collection(refCollection as string)
            .find(
              {},
              {
                projection: {
                  [exposedColumn]: 1
                }
              }
            )
            .toArray();

          const options = refCollectionData.map(doc => ({
            label: doc[exposedColumn],
            value: convertObjectIdsToString(doc)
          }));

          const initialOption = options.find(o => o.value._id === data[key]);

          return {
            type: "select",
            name: key,
            label,
            value: initialOption ? initialOption.value : options[0].value,
            options
          };
        default:
          throw new Error(`Unknown field type: ${type}`);
      }
    })
  );
}
