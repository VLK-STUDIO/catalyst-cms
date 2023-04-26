import { logWarning } from "./logger";
import { CatalystCollection, CatalystReferenceField } from "./types";

export const makePayloadLocalized = (
  payload: any,
  locale: string,
  collectionFields: CatalystCollection["fields"]
) => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if ("localized" in collectionFields[key]) {
        return [key, { [locale]: value }];
      }

      return [key, value];
    })
  );
};

export const delocalizePayload = (
  payload: Record<string, string | Record<string, string>>,
  collectionFields: CatalystCollection["fields"],
  locale: string,
  fallbackLocale: string
) => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if (!collectionFields[key]) {
        // This is likely the object _id field
        // so we just return as-is
        return [key, value];
      }

      if ("localized" in collectionFields[key]) {
        if (typeof value !== "object") {
          logWarning(
            `Expected an object for localized field '${key}', but got '${typeof value}'. This is not an error, but it means your localized column contains stale data. You should perform a migration on this field to fix this.`
          );
          return [key, value];
        }

        if (value[locale]) return [key, value[locale]];

        return [key, value[fallbackLocale]];
      }

      return [key, value];
    })
  );
};

export function getCollectionReferenceFields(collection: CatalystCollection) {
  return Object.entries(collection.fields).filter(
    ([_, value]) => value.type === "reference"
  ) as [string, CatalystReferenceField][];
}
