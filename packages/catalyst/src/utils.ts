import { ObjectId } from "mongodb";
import _ from "lodash";
import { logWarning } from "./logger";
import { CatalystConfig, CatalystFields } from "./types";

export const makePayloadLocalized = (
  payload: any,
  locale: string,
  collectionFields: CatalystConfig["collections"][string]["fields"]
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
  payload: any,
  collectionFields: CatalystConfig["collections"][string]["fields"],
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

export const makeMongoPayloadSerializable = (payload: any) => {
  return deepIterateOnKey(payload, (id) => id.toString(), "_id");
};

export const deserializeMongoPayload = (payload: any) => {
  return deepIterateOnKey(payload, (id) => new ObjectId(id), "_id");
};

function deepIterateOnKey(
  obj: Object,
  callback: (val: any) => any,
  key: string
): any {
  const newObj: any = {};

  for (const [k, v] of Object.entries(obj)) {
    if (k === key) {
      newObj[k] = callback(v);
    } else if (typeof v === "object" && v !== null) {
      newObj[k] = deepIterateOnKey(v, callback, key);
    } else {
      newObj[k] = v;
    }
  }

  return newObj;
}
