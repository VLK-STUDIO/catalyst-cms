import { NextApiRequest, NextApiResponse } from "next";
import mongoClientPromise from "../mongo";
import { CatalystAuth, CatalystConfig } from "../types";
import { deserializeMongoPayload, makePayloadLocalized } from "../utils";
import { canUserUpdateDataType } from "../access";
import { flatten } from "flat";
import { ObjectId } from "mongodb";

export function isCollectionEntryUpdateEndpoint(req: NextApiRequest) {
  const [typeKind] = req.query.catalyst as string[];

  return req.method === "PATCH" && typeKind === "collection";
}

export async function handleCollectionEntryUpdate(
  config: CatalystConfig,
  req: NextApiRequest,
  res: NextApiResponse,
  auth: CatalystAuth,
) {
  const [_, collectionKey, docId] = req.query.catalyst as string[];

  const collection = config.collections[collectionKey];
  if (!collection) {
    return res.status(404).end();
  }

  const session = await auth.getSessionFromRequest(req, res);

  if (!canUserUpdateDataType(session, collection)) {
    return res.status(403).json({
      error: "Unauthorized",
    });
  }

  let json: any;
  try {
    json = JSON.parse(req.body);
  } catch {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  // TODO: Validate payload

  if (collection.hooks && collection.hooks.beforeUpdate) {
    json = await collection.hooks.beforeUpdate(json);
  }

  if (req.query.locale && typeof req.query.locale !== "string") {
    return res.status(400).json({ message: "Invalid locale" });
  }

  const locale = req.query.locale || config.i18n.defaultLocale;

  const localizedPayload = makePayloadLocalized(
    json,
    locale,
    collection.fields,
  );
  const deserializedPayload = deserializeMongoPayload(
    localizedPayload,
    collection.fields,
  );

  // Flatten payload into nested string paths with dots
  // for atomic updates in Mongo
  const flattenedPayload = flatten(deserializedPayload);

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
        },
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
