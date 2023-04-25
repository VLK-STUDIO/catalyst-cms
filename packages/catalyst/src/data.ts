import { ObjectId } from "mongodb";
import mongoClientPromise from "./mongo";
import { CatalystConfig, CatalystData } from "./types";
import { delocalisePayload } from "./utils";
import { getLivePreviewDataForCollection } from "./preview";

export function createCatalystDataObject<C extends CatalystConfig>(config: C) {
  return Object.keys(config.collections).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        find: async (locale?: string) => {
          const livePreviewData = getLivePreviewDataForCollection(key);

          if (livePreviewData) {
            return [livePreviewData];
          }

          const client = await mongoClientPromise;

          const docs = await client.db().collection(key).find().toArray();

          return docs.map((doc) =>
            delocalisePayload(
              doc,
              config.collections[key].fields,
              locale || config.i18n.defaultLocale,
              config.i18n.defaultLocale
            )
          );
        },
        findOne: async (
          id: string,
          locale?: string,
          options: {
            delocalise: boolean;
          } = { delocalise: true }
        ) => {
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
                  ...Object.keys(config.collections[key].fields).reduce(
                    (acc, curr) => ({ ...acc, [curr]: 1 }),
                    {}
                  ),
                },
              }
            );

          if (!doc) {
            throw new Error("Document not found");
          }

          if (options.delocalise) {
            return delocalisePayload(
              doc,
              config.collections[key].fields,
              locale || config.i18n.defaultLocale,
              config.i18n.defaultLocale
            );
          }

          return doc;
        },
      },
    };
  }, {} as CatalystData<C>);
}
