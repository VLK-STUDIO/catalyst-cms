import { ObjectId } from "mongodb";
import mongoClientPromise from "./mongo";
import {
  CatalystCollectionDataObject,
  CatalystConfig,
  CatalystDataObject,
  CatalystGlobalsDataObject,
} from "./types";
import { delocalizePayload } from "./utils";
import { getLivePreviewDataForCollection } from "./preview";

export function createCatalystDataObject<C extends CatalystConfig>(config: C) {
  const { collections = {}, globals = {} } = config;

  const collectionsDataObject = Object.keys(collections).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        find: async (locale?: string) => {
          const client = await mongoClientPromise;

          const docs = await client.db().collection(key).find().toArray();

          return docs.map((doc) =>
            delocalizePayload(
              doc,
              collections[key].fields,
              locale || config.i18n.defaultLocale,
              config.i18n.defaultLocale
            )
          );
        },
        findOne: async (
          id: string,
          locale?: string,
          options: {
            delocalize: boolean;
          } = { delocalize: true }
        ) => {
          const livePreviewData = getLivePreviewDataForCollection(key);

          if (livePreviewData) {
            return livePreviewData;
          }

          const client = await mongoClientPromise;

          const doc = await client
            .db()
            .collection(key)
            .findOne(
              {
                _id: {
                  $eq: new ObjectId(id),
                },
              },
              {
                projection: {
                  _id: 0,
                  ...Object.keys(collections[key].fields).reduce(
                    (acc, curr) => ({ ...acc, [curr]: 1 }),
                    {}
                  ),
                },
              }
            );

          if (!doc) {
            throw new Error("Document not found");
          }

          if (options.delocalize) {
            return delocalizePayload(
              doc,
              collections[key].fields,
              locale || config.i18n.defaultLocale,
              config.i18n.defaultLocale
            );
          }

          return doc;
        },
      },
    };
  }, {} as CatalystCollectionDataObject<C["collections"]>);

  const globalsDataObject = Object.keys(globals).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        get: async (
          locale?: string,
          options: {
            delocalize: boolean;
          } = { delocalize: true }
        ) => {
          const client = await mongoClientPromise;

          const doc = await client
            .db()
            .collection(key)
            .findOne(
              {},
              {
                projection: {
                  _id: 0,
                  ...Object.keys(globals[key].fields).reduce(
                    (acc, curr) => ({ ...acc, [curr]: 1 }),
                    {}
                  ),
                },
              }
            );

          if (!doc) {
            throw new Error("Document not found");
          }

          if (options.delocalize) {
            return delocalizePayload(
              doc,
              globals[key].fields,
              locale || config.i18n.defaultLocale,
              config.i18n.defaultLocale
            );
          }

          return doc;
        },
      },
    };
  }, {} as CatalystGlobalsDataObject<C["globals"]>);

  return {
    ...collectionsDataObject,
    ...globalsDataObject,
  } satisfies CatalystDataObject<C>;
}
