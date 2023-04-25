import { NextApiRequest, NextApiResponse } from "next";
import mongoClientPromise from "../mongo";
import { CatalystConfig } from "../types";
import { makePayloadLocalised } from "../utils";
import { forEachFieldInCollection } from "./utils";

export function isCollectionEntryCreationEndpoint(req: NextApiRequest) {
  return req.method === "POST";
}

export async function handleCollectionEntryCreation(
  config: CatalystConfig,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get query params
  const [collectionKey] = req.query.catalyst as string[];

  // Check if collection param is valid
  const collection = config.collections[collectionKey];
  if (!collection) {
    return res.status(404).end();
  }

  // Parse JSON body
  let json: any;
  try {
    json = JSON.parse(req.body);
  } catch {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  // TODO: Validate using field zod schema

  // Run creation hooks
  await Promise.all(
    forEachFieldInCollection(collection, async (field, key) => {
      if (field.hooks && field.hooks.beforeCreate) {
        json[key] = await field.hooks.beforeCreate(json[key]);
      }
    })
  );

  // Make sure request locale is valid
  if (req.query.locale && typeof req.query.locale !== "string") {
    return res.status(400).json({
      error: "Invalid locale",
    });
  }

  // Use locale if in query, otherwise use default locale
  const locale = req.query.locale || config.i18n.defaultLocale;

  // Apply locale to localized fields
  const payload = makePayloadLocalised(json, locale, collection.fields);

  // Insert document into MongoDB
  const client = await mongoClientPromise;
  try {
    const result = await client
      .db()
      .collection(collectionKey)
      .insertOne(payload);

    return res.status(201).json({
      _id: result.insertedId.toString(),
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to insert document:" + (err as Error).message,
    });
  }
}
