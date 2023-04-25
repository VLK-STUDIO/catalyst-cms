import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import flatten from "flat";
import mongoClientPromise from "../mongo";
import { CatalystConfig } from "../types";
import { makePayloadLocalised } from "../utils";
import { forEachFieldInCollection } from "./utils";

export function isCollectionEntryUpdateEndpoint(req: NextApiRequest) {
  return req.method === "PATCH";
}

export async function handleCollectionEntryUpdate(
  config: CatalystConfig,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get query params
  const [collectionKey, docId] = req.query.catalyst as string[];

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

  // TODO: Validate payload

  // Run update hooks
  await Promise.all(
    forEachFieldInCollection(collection, async (field, key) => {
      if (field.hooks && field.hooks.beforeUpdate) {
        json[key] = await field.hooks.beforeUpdate(json[key]);
      }
    })
  );

  // Make sure request locale is valid
  if (req.query.locale && typeof req.query.locale !== "string") {
    return res.status(400).json({ message: "Invalid locale" });
  }

  // Use locale if in query, otherwise use default locale
  const locale = req.query.locale || config.i18n.defaultLocale;

  // Apply locale to localized fields
  const payload = makePayloadLocalised(
    json,
    locale,
    config.collections[collectionKey].fields
  );

  // Flatten localized data for atomic update in mongo
  const flattenedPayload = flatten(payload);

  // Update document in MongoDB
  const client = await mongoClientPromise;

  try {
    await client
      .db()
      .collection(collectionKey)
      .updateOne(
        {
          _id: {
            $eq: new ObjectId(docId),
          },
        },
        {
          $set: flattenedPayload,
        }
      );
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update document: " + (err as Error).message,
    });
  }

  return res.status(200).json({
    success: true,
  });
}
