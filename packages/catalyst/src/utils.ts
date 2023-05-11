import { ObjectId } from "mongodb";
import _ from "lodash";
import { logWarning } from "./logger";
import {
  CatalystConfig,
  CatalystFieldType,
  CatalystFields,
  UserCatalystConfig
} from "./types";

/**
 * Applies the given locale to a payload
 * for every field that has `localized` set to `true`.
 *
 * @param payload The payload to localize
 * @param locale The locale to apply
 * @param collectionFields The fields of the collection
 * @returns The localized payload
 */
export const makePayloadLocalized = (
  payload: any,
  locale: string,
  collectionFields: CatalystFields<any>
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

/**
 * Flattens a document by removing the nested objects
 * for every field that has `localized` set to `true`.
 *
 * The used value is either taken from the passed locale
 * if it exists or the fallback locale.
 *
 * @param payload The payload to flatten
 * @param collectionFields The fields of the collection
 * @param locale The locale to apply
 * @param fallbackLocale The fallback locale to apply
 * @returns The flattened payload
 */
export const delocalizePayload = (
  payload: any,
  collectionFields: CatalystFields<any>,
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

        // @ts-ignore
        if (value[locale]) return [key, value[locale]];

        // @ts-ignore
        return [key, value[fallbackLocale]];
      }

      return [key, value];
    })
  );
};

/**
 * Makes a MongoDB document serializable in RSCs by converting
 * all ObjectIds to strings.
 *
 * @param payload Anything with Object IDs
 * @param dataTypeFields A map of field names to their data types
 * @returns payload with Object IDs converted to strings
 */
export const makeMongoPayloadSerializable = (
  payload: any,
  dataTypeFields: CatalystFields<any>
) => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      const field = dataTypeFields[key];

      if ((field && field.type === "reference") || key === "_id") {
        if (value instanceof ObjectId) {
          return [key, value.toString()];
        }
      }

      return [key, value];
    })
  ) as any;
};

/**
 * Deserializes a MongoDB document sent by client components
 * by converting all strings to ObjectIds to be stored in the DB.
 *
 * @param payload Anything with Object IDs
 * @param dataTypeFields A map of field names to their data types
 * @returns payload with Object IDs converted to strings
 */
export const deserializeMongoPayload = (
  payload: any,
  dataTypeFields: CatalystFields<any>
) => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      const field = dataTypeFields[key];

      if (field && field.type === "reference") {
        if (typeof value !== "string")
          throw new Error(
            `Expected a string for reference field '${key}', but got '${typeof value}'.`
          );

        return [key, new ObjectId(value)];
      }

      return [key, value];
    })
  );
};

/**
 * Recursively iterates through an object and
 * calls `.toString()` on all fields named `_id`
 *
 * @param payload Anything with Object IDs
 * @returns payload with Object IDs converted to strings
 */
export function convertObjectIdsToString(payload: any) {
  return deepIterateOnKey(payload, "_id", (val: ObjectId) => val.toString());
}

/**
 * Recursively iterates through an object and executes a callback
 * when a target key is found.
 *
 * The callback is passed the value of the target key.
 *
 * @param obj Any object
 * @param key A key to search for
 * @param callback A callback to execute when the key is found
 * @returns The original object with the callback applied to the target key
 */
function deepIterateOnKey(
  obj: Object,
  key: string,
  callback: (val: any) => any
): any {
  const newObj: any = {};

  for (const [k, v] of Object.entries(obj)) {
    if (k === key) {
      newObj[k] = callback(v);
    } else if (typeof v === "object" && v !== null) {
      newObj[k] = deepIterateOnKey(v, key, callback);
    } else {
      newObj[k] = v;
    }
  }

  return newObj;
}

/**
 * Return a object that contains all the fields with exposed set to true if the exposed is undefined
 *
 * The types that already have exposed set to false or are in the excludedFields are ignored
 *
 * @param fields The fields of the collection
 * @param excludedFields An array of field types that will have exposed set to false
 * @returns An object that update all the fields with exposed set to true if the exposed is undefined
 */
function setExposedToFields({
  fields
}: {
  fields: CatalystFields<CatalystConfig>;
}) {
  return Object.entries(fields).reduce((acc, [key, field]) => {
    if (field.exposed === undefined) {
      return {
        ...acc,
        [key]: {
          ...field,
          exposed: true
        }
      };
    }
    return {
      ...acc
    };
  }, {});
}

/**
 * Get the cms collections that contains all the fields with exposed set to true if that is undefined and the excludedFields are not in the excludedFields array.
 *
 *
 * @param config The cms config object
 * @returns cms config with all the fields exposed value set to true
 */
export function updateCollectionFields(config: UserCatalystConfig) {
  const updatedCollectionFields = Object.entries(config.collections).reduce(
    (acc, [key, collection]) => {
      return {
        ...acc,
        [key]: {
          ...collection,
          fields: setExposedToFields({
            fields: collection.fields
          })
        }
      };
    },
    {}
  );

  return updatedCollectionFields;
}
