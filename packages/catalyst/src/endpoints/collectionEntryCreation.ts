import { NextApiRequest, NextApiResponse } from "next";
import mongoClientPromise from "../mongo";
import { CatalystAuth, CatalystConfig } from "../types";
import { deserializeMongoPayload, makePayloadLocalized } from "../utils";
import { canUserCreateCollectionEntry } from "../access";
import { getPayloadWithDerivedFields } from "./utils";

export function isCollectionEntryCreationEndpoint(req: NextApiRequest) {
  const [typeKind] = req.query.catalyst as string[];

  return req.method === "POST" && typeKind === "collection";
}

export async function handleCollectionEntryCreation(
  config: CatalystConfig,
  req: NextApiRequest,
  res: NextApiResponse,
  auth: CatalystAuth
) {
  // Get query params
  const [_, collectionKey] = req.query.catalyst as string[];

  // Check if collection param is valid
  const collection = config.collections[collectionKey];
  if (!collection) {
    return res.status(404).end();
  }

  const session = await auth.getSessionFromRequest(req, res);

  if (!canUserCreateCollectionEntry(session, collection)) {
    return res.status(403).json({
      error: "Unauthorized"
    });
  }

  // Parse JSON body
  let json: any;
  try {
    json = JSON.parse(req.body);
  } catch {
    return res.status(400).json({
      error: "Invalid JSON"
    });
  }

  // TODO: Validate using field zod schema

  // Run creation hooks
  if (collection.hooks && collection.hooks.beforeCreate) {
    json = await collection.hooks.beforeCreate(json);
  }

  const payloadWithDerivedFields = await getPayloadWithDerivedFields(
    collection.fields,
    json
  );

  // Make sure request locale is valid
  if (req.query.locale && typeof req.query.locale !== "string") {
    return res.status(400).json({
      error: "Invalid locale"
    });
  }

  // Use locale if in query, otherwise use default locale
  const locale = req.query.locale || config.i18n.defaultLocale;

  // Apply locale to localized fields
  const localizedPayload = makePayloadLocalized(
    payloadWithDerivedFields,
    locale,
    collection.fields
  );

  const deserializedPayload = deserializeMongoPayload(
    localizedPayload,
    collection.fields
  );

  // Insert document into MongoDB
  const client = await mongoClientPromise;
  try {
    const result = await client
      .db()
      .collection(collectionKey)
      .insertOne(deserializedPayload);

    return res.status(201).json({
      _id: result.insertedId
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to insert document:" + (err as Error).message
    });
  }
}
