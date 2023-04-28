import { ObjectId } from "mongodb";
import mongoClientPromise from "./mongo";
import {
  CatalystCollectionDataObject,
  CatalystConfig,
  CatalystGlobalsDataObject,
} from "./types";
import { delocalizePayload } from "./utils";
import { getCatalystServerSession } from "./auth";
import { canUserReadDataType } from "./access";

export function createCatalystDataObject<C extends CatalystConfig>(config: C) {
  const { collections, globals } = config;

  const collectionsDataObject = Object.keys(collections).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        findAsUser: createFindAsUserFunction(key, config),
        findOneAsUser: createFindOneAsUserFunction(key, config),
        find: createFindFunction(key, config),
        findOne: createFindOneFunction(key, config),
      },
    };
  }, {} as CatalystCollectionDataObject<C["collections"]>);

  const globalsDataObject = Object.keys(globals).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        getAsUser: createGetAsUserFunction(key, config),
        get: createGetFunction(key, config),
      },
    };
  }, {} as CatalystGlobalsDataObject<C["globals"]>);

  return {
    ...collectionsDataObject,
    ...globalsDataObject,
  };
}

function createFindAsUserFunction(
  collectionKey: string,
  config: CatalystConfig
) {
  const collection = config.collections[collectionKey];

  return async (locale?: string) => {
    const session = await getCatalystServerSession();

    if (!canUserReadDataType(session, collection)) {
      throw new Error(`Unauthorized read of collection '${collectionKey}'`);
    }

    const find = createFindFunction(collectionKey, config);

    return await find(locale);
  };
}

function createFindOneAsUserFunction(
  collectionKey: string,
  config: CatalystConfig
) {
  const collection = config.collections[collectionKey];

  return async (id: string, locale?: string) => {
    const session = await getCatalystServerSession();

    if (!canUserReadDataType(session, collection)) {
      throw new Error(`Unauthorized read of collection '${collectionKey}'`);
    }

    const findOne = createFindOneFunction(collectionKey, config);

    return await findOne(id, locale);
  };
}

function createFindFunction(collectionKey: string, config: CatalystConfig) {
  const collection = config.collections[collectionKey];

  return async (locale?: string) => {
    const client = await mongoClientPromise;

    const docs = await client.db().collection(collectionKey).find().toArray();

    return docs.map((doc) =>
      delocalizePayload(
        doc,
        collection.fields,
        locale || config.i18n.defaultLocale,
        config.i18n.defaultLocale
      )
    );
  };
}

function createFindOneFunction(collectionKey: string, config: CatalystConfig) {
  const collection = config.collections[collectionKey];

  return async (id: string, locale?: string) => {
    const client = await mongoClientPromise;

    const doc = await client
      .db()
      .collection(collectionKey)
      .findOne({
        _id: {
          $eq: new ObjectId(id),
        },
      });

    if (!doc) {
      throw new Error("Document not found");
    }

    return delocalizePayload(
      doc,
      collection.fields,
      locale || config.i18n.defaultLocale,
      config.i18n.defaultLocale
    );
  };
}

function createGetAsUserFunction(globalKey: string, config: CatalystConfig) {
  const global = config.globals[globalKey];

  return async (locale?: string) => {
    const session = await getCatalystServerSession();

    if (!canUserReadDataType(session, global)) {
      throw new Error(`Unauthorized read of global '${globalKey}'`);
    }

    const get = createGetFunction(globalKey, config);

    return await get(locale);
  };
}

function createGetFunction(globalKey: string, config: CatalystConfig) {
  const global = config.globals[globalKey];

  return async (locale?: string) => {
    const client = await mongoClientPromise;

    const doc = await client.db().collection(globalKey).findOne();

    if (!doc) {
      throw new Error("Document not found");
    }

    return delocalizePayload(
      doc,
      global.fields,
      locale || config.i18n.defaultLocale,
      config.i18n.defaultLocale
    );
  };
}
