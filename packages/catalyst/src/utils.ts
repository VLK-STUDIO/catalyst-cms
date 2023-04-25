import { logWarning } from "./logger";
import {
  CatalystCollection,
  CatalystConfig,
  CatalystReferenceField,
  SerializableCatalystCollection,
  SerializableCatalystConfig,
} from "./types";

export const serializeCatalystConfig = (
  config: CatalystConfig
): SerializableCatalystConfig => {
  return {
    ...config,
    collections: Object.fromEntries(
      Object.entries(config.collections).map(([key, value]) => {
        return [key, serializeCatalystCollection(value)];
      })
    ),
  };
};

export const serializeCatalystCollection = (
  collection: CatalystCollection
): SerializableCatalystCollection => {
  return {
    ...collection,
    fields: Object.fromEntries(
      Object.entries(collection.fields).map(([key, value]) => {
        // TODO: Filter non-serializable data (such as zod validation schema or hooks)
        return [key, value];
      })
    ),
  };
};

export const makePayloadLocalised = (
  payload: any,
  locale: string,
  collectionFields: CatalystCollection["fields"]
) => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if ("localised" in collectionFields[key]) {
        return [key, { [locale]: value }];
      }

      return [key, value];
    })
  );
};

export const delocalisePayload = (
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

      if ("localised" in collectionFields[key]) {
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
