import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import mongoClientPromise from "../mongo";
import { CatalystConfig } from "../types";
import { makePayloadLocalized } from "../utils";
import { forEachFieldInCollection } from "./utils";

export function isCollectionEntryUpdateEndpoint(req: NextApiRequest) {
  const [typeKind] = req.query.catalyst as string[];

  return req.method === "PATCH" && typeKind === "collection";
}

export async function handleCollectionEntryUpdate(
  config: CatalystConfig,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get query params
  const [_, collectionKey, docId] = req.query.catalyst as string[];

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
  const payload = makePayloadLocalized(json, locale, collection.fields);

  // Update document in MongoDB
  const client = await mongoClientPromise;

  try {
    await client
      .db()
      .collection(collectionKey)
      .replaceOne(
        {
          _id: {
            $eq: new ObjectId(docId),
          },
        },
        payload
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
