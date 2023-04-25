import { CatalystCollection } from "../../types";
import { FormField } from "./types";
import mongoClientPromise from "../../mongo";

export function getFormFieldsFromCollection(
  collection: CatalystCollection,
  data: Record<string, any> = {}
): Promise<FormField[]> {
  return Promise.all(
    Object.entries(collection.fields).map(async ([key, field]) => {
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
          const { collection: refCollection, exposedColumn } = field;

          const client = await mongoClientPromise;

          const refCollectionData = await client
            .db()
            .collection(refCollection)
            .find(
              {},
              {
                projection: {
                  _id: 1,
                  ...(exposedColumn ? { [exposedColumn]: 1 } : {}),
                },
              }
            )
            .toArray();

          const options = refCollectionData.map((doc) => {
            const id = doc._id.toString();

            return {
              label: exposedColumn ? doc[exposedColumn] : id,
              value: id,
            };
          });

          return {
            type: "select",
            name: key,
            label,
            value: data[key] || "",
            options,
          };
        default:
          throw new Error(`Unknown field type: ${type}`);
      }
    })
  );
}
