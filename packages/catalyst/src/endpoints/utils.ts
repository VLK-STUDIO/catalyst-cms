import { CatalystCollection, CatalystField } from "../types";

export function forEachFieldInCollection(
  collection: CatalystCollection,
  callback: (field: CatalystField, key: string) => any
) {
  // TODO: Handle nested fields
  return Object.entries(collection.fields).map(([key, field]) =>
    callback(field, key)
  );
}
