import { CatalystDataType } from "../../../types";
import { FormField } from "./types";
import mongoClientPromise from "../../../mongo";

export function getFormFieldsFromDataType(
  dataType: CatalystDataType,
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
            value: data[key] || "",
          };
        case "richtext":
          return {
            type,
            name: key,
            label,
            value: data[key] || "",
          };
        case "reference":
          const { collection: refCollection } = field;

          const exposedColumn = field.exposedColumn || "_id";

          const client = await mongoClientPromise;

          const refCollectionData = await client
            .db()
            .collection(refCollection)
            .find(
              {},
              {
                projection: {
                  [exposedColumn]: 1,
                },
              }
            )
            .toArray();

          const options = refCollectionData.map((doc) => ({
            label: doc[exposedColumn],
            value: doc._id.toString(),
          }));

          return {
            type: "select",
            name: key,
            label,
            value: data[key] ? data[key][exposedColumn] : "",
            options,
          };
        default:
          throw new Error(`Unknown field type: ${type}`);
      }
    })
  );
}