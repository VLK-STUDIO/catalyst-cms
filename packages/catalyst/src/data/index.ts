import mongoClientPromise from "../mongo";
import { CatalystAuth, CatalystConfig, CatalystDataType } from "../types";
import { delocalizePayload, makeMongoPayloadSerializable } from "../utils";
import { canUserReadDataType } from "../access";
import {
  CatalystCollectionDataObject,
  CatalystDataObject,
  CatalystFindDataFunction,
  CatalystFindOneDataFunction,
  CatalystGetDataFunction,
  CatalystGlobalsDataObject,
  QueryOptions
} from "./types";
import { getLivePreviewDataForCollection } from "../preview";

export function createCatalystDataObject<const C extends CatalystConfig>(
  config: C,
  auth: CatalystAuth
): CatalystDataObject<C> {
  const { collections, globals } = config;

  const collectionsDataObject = Object.keys(collections).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        findAsUser: createFindAsUserFunction({ config, auth }, key),
        findOneAsUser: createFindOneAsUserFunction({ config, auth }, key),
        find: createFindFunction(config, key),
        findOne: createFindOneFunction(config, key)
      }
    };
  }, {} as CatalystCollectionDataObject<C>);

  const globalsDataObject = Object.keys(globals).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        getAsUser: createGetAsUserFunction({ config, auth }, key),
        get: createGetFunction(config, key)
      }
    };
  }, {} as CatalystGlobalsDataObject<C>);

  return {
    ...collectionsDataObject,
    ...globalsDataObject
  };
}

function createFindAsUserFunction(
  {
    config,
    auth
  }: {
    config: CatalystConfig;
    auth: CatalystAuth;
  },
  collectionKey: string
) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindDataFunction<
    typeof config,
    typeof collectionKey
  > = async options => {
    const session = await auth.getSession();

    if (!canUserReadDataType(session, collection)) {
      throw new Error(`Unauthorized read of collection '${collectionKey}'`);
    }

    const find = createFindFunction(config, collectionKey);

    return await find(options);
  };

  return func;
}

function createFindOneAsUserFunction(
  {
    config,
    auth
  }: {
    config: CatalystConfig;
    auth: CatalystAuth;
  },
  collectionKey: string
) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindOneDataFunction<
    typeof config,
    typeof collectionKey
  > = async options => {
    const session = await auth.getSession();

    if (!canUserReadDataType(session, collection)) {
      throw new Error(`Unauthorized read of collection '${collectionKey}'`);
    }

    const findOne = createFindOneFunction(config, collectionKey);

    return await findOne(options);
  };

  return func;
}

function createFindFunction(config: CatalystConfig, collectionKey: string) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindDataFunction<
    typeof config,
    typeof collectionKey
  > = async (options = {}) => {
    const pipeline = createPipeline(options, collection);

    const client = await mongoClientPromise;

    const docs = await client
      .db()
      .collection(collectionKey)
      .aggregate(pipeline)
      .toArray();

    return docs.map(doc =>
      makeMongoPayloadSerializable(
        delocalizePayload(
          doc,
          collection.fields,
          options.locale || config.i18n.defaultLocale,
          config.i18n.defaultLocale
        ),
        collection.fields
      )
    );
  };

  return func;
}

function createFindOneFunction<C extends CatalystConfig>(
  config: C,
  collectionKey: string
) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindOneDataFunction<
    typeof config,
    typeof collectionKey
  > = async options => {
    const livePreviewData = getLivePreviewDataForCollection(collectionKey);

    if (livePreviewData) {
      return livePreviewData;
    }

    const pipeline = createPipeline({ ...options, limit: 1 }, collection);

    const client = await mongoClientPromise;

    const docs = await client
      .db()
      .collection(collectionKey)
      .aggregate(pipeline)
      .toArray();

    return docs.map(doc =>
      makeMongoPayloadSerializable(
        delocalizePayload(
          doc,
          collection.fields,
          options.locale || config.i18n.defaultLocale,
          config.i18n.defaultLocale
        ),
        collection.fields
      )
    )[0];
  };

  return func;
}

function createGetAsUserFunction(
  { config, auth }: { config: CatalystConfig; auth: CatalystAuth },
  globalKey: string
) {
  const global = config.globals[globalKey];

  const func: CatalystGetDataFunction<typeof config, typeof globalKey> = async (
    options = {}
  ) => {
    const session = await auth.getSession();

    if (!canUserReadDataType(session, global)) {
      throw new Error(`Unauthorized read of global '${globalKey}'`);
    }

    const get = createGetFunction(config, globalKey);

    return await get(options);
  };

  return func;
}

function createGetFunction(config: CatalystConfig, globalKey: string) {
  const global = config.globals[globalKey];

  const func: CatalystGetDataFunction<typeof config, typeof globalKey> = async (
    options = {}
  ) => {
    const pipeline = createPipeline(
      {
        ...options,
        limit: 1
      },
      global
    );

    const client = await mongoClientPromise;

    const docs = await client
      .db()
      .collection(globalKey)
      .aggregate(pipeline)
      .toArray();

    return docs.map(doc =>
      makeMongoPayloadSerializable(
        delocalizePayload(
          doc,
          global.fields,
          options.locale || config.i18n.defaultLocale,
          config.i18n.defaultLocale
        ),
        global.fields
      )
    )[0];
  };

  return func;
}

function createPipeline(
  options: QueryOptions<any>,
  dataType: CatalystDataType<any>
) {
  const pipeline: Array<any> = [];

  if (options.filters) {
    pipeline.push({
      $match: options.filters
    });
  }

  const referenceFields: Record<string, string> = {};

  if (options.include) {
    for (const includedColumn of options.include) {
      const field = dataType.fields[includedColumn as string];

      if (field.type === "reference") {
        referenceFields[includedColumn as string] = field.collection as string;
      }
    }
  }

  if (options.autopopulate) {
    for (const [column, field] of Object.entries(dataType.fields)) {
      if (field.type === "reference") {
        referenceFields[column] = field.collection as string;
      }
    }
  }

  for (const [column, refCollection] of Object.entries(referenceFields)) {
    pipeline.push({
      $lookup: {
        from: refCollection,
        localField: column,
        foreignField: "_id",
        as: column
      }
    });
  }

  if (options.include) {
    pipeline.push({
      $project: options.include.reduce(
        (acc, key) => ({
          ...acc,
          [key]: 1
        }),
        {}
      )
    });
  }

  for (const [column] of Object.entries(referenceFields)) {
    pipeline.push({
      $unwind: {
        path: `$${column}`,
        preserveNullAndEmptyArrays: true
      }
    });
  }

  if (options.limit) {
    pipeline.push({
      $limit: options.limit
    });
  }

  return pipeline;
}
