import mongoClientPromise from "../mongo";
import { CatalystConfig, CatalystDataType } from "../types";
import { delocalizePayload, makeMongoPayloadSerializable } from "../utils";
import { getCatalystServerSession } from "../auth";
import { canUserReadDataType } from "../access";
import {
  CatalystCollectionDataObject,
  CatalystDataObject,
  CatalystFindDataFunction,
  CatalystFindOneDataFunction,
  CatalystGetDataFunction,
  CatalystGlobalsDataObject,
  QueryOptions,
} from "./types";
import { getLivePreviewDataForCollection } from "../preview";

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
  }, {} as CatalystCollectionDataObject<C>);

  const globalsDataObject = Object.keys(globals).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        getAsUser: createGetAsUserFunction(key, config),
        get: createGetFunction(key, config),
      },
    };
  }, {} as CatalystGlobalsDataObject<C>);

  return {
    ...collectionsDataObject,
    ...globalsDataObject,
  } as CatalystDataObject<C>;
}

function createFindAsUserFunction(
  collectionKey: string,
  config: CatalystConfig
) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindDataFunction<
    typeof config,
    typeof collectionKey
  > = async (options) => {
    const session = await getCatalystServerSession();

    if (!canUserReadDataType(session, collection)) {
      throw new Error(`Unauthorized read of collection '${collectionKey}'`);
    }

    const find = createFindFunction(collectionKey, config);

    return await find(options);
  };

  return func;
}

function createFindOneAsUserFunction(
  collectionKey: string,
  config: CatalystConfig
) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindOneDataFunction<
    typeof config,
    typeof collectionKey
  > = async (options) => {
    const session = await getCatalystServerSession();

    if (!canUserReadDataType(session, collection)) {
      throw new Error(`Unauthorized read of collection '${collectionKey}'`);
    }

    const findOne = createFindOneFunction(collectionKey, config);

    return await findOne(options);
  };

  return func;
}

function createFindFunction(collectionKey: string, config: CatalystConfig) {
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

    return docs.map((doc) =>
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
  collectionKey: string,
  config: C
) {
  const collection = config.collections[collectionKey];

  const func: CatalystFindOneDataFunction<
    typeof config,
    typeof collectionKey
  > = async (options) => {
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

    return docs.map((doc) =>
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

function createGetAsUserFunction(globalKey: string, config: CatalystConfig) {
  const global = config.globals[globalKey];

  const func: CatalystGetDataFunction<typeof config, typeof globalKey> = async (
    options = {}
  ) => {
    const session = await getCatalystServerSession();

    if (!canUserReadDataType(session, global)) {
      throw new Error(`Unauthorized read of global '${globalKey}'`);
    }

    const get = createGetFunction(globalKey, config);

    return await get(options);
  };

  return func;
}

function createGetFunction(globalKey: string, config: CatalystConfig) {
  const global = config.globals[globalKey];

  const func: CatalystGetDataFunction<typeof config, typeof globalKey> = async (
    options = {}
  ) => {
    const pipeline = createPipeline(
      {
        ...options,
        limit: 1,
      },
      global
    );

    const client = await mongoClientPromise;

    const docs = await client
      .db()
      .collection(globalKey)
      .aggregate(pipeline)
      .toArray();

    return docs.map((doc) =>
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
      $match: options.filters,
    });
  }

  const referenceFields: [string, any][] = [];

  if (options.include) {
    for (const includedColumn of options.include) {
      const field = dataType.fields[includedColumn as string];

      if (field.type === "reference") {
        referenceFields.push([includedColumn as string, field]);
      }
    }
  }

  for (const [column, field] of referenceFields) {
    pipeline.push({
      $lookup: {
        from: field.collection,
        localField: column,
        foreignField: "_id",
        as: column,
      },
    });
  }

  if (options.include) {
    pipeline.push({
      $project: options.include.reduce(
        (acc, key) => ({
          ...acc,
          [key]: 1,
        }),
        {}
      ),
    });
  }

  for (const [column] of referenceFields) {
    pipeline.push({
      $unwind: {
        path: `$${column}`,
        preserveNullAndEmptyArrays: true,
      },
    });
  }

  if (options.limit) {
    pipeline.push({
      $limit: options.limit,
    });
  }

  return pipeline;
}
