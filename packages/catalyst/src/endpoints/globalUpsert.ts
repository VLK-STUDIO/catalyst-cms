import { NextApiRequest, NextApiResponse } from "next";
import flatten from "flat";
import mongoClientPromise from "../mongo";
import { CatalystConfig } from "../types";
import { deserializeMongoPayload, makePayloadLocalized } from "../utils";
import { canUserUpdateDataType } from "../access";
import { getCatalystServerSession } from "../auth";

export function isGlobalUpsertEndpoint(req: NextApiRequest) {
  const [typeKind] = req.query.catalyst as string[];

  return req.method === "POST" && typeKind === "global";
}

export async function handleGlobalUpsert(
  config: CatalystConfig,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const [_, globalKey] = req.query.catalyst as string[];

  const global = config.globals[globalKey];
  if (!global) {
    return res.status(404).end();
  }

  const session = await getCatalystServerSession();

  if (!canUserUpdateDataType(session, global)) {
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

  // Run hooks
  if (global.hooks && global.hooks.beforeUpdate) {
    json = await global.hooks.beforeUpdate(json);
  }

  // Make sure request locale is valid
  if (req.query.locale && typeof req.query.locale !== "string") {
    return res.status(400).json({ message: "Invalid locale" });
  }

  // Use locale if in query, otherwise use default locale
  const locale = req.query.locale || config.i18n.defaultLocale;

  // Apply locale to localized fields
  const localizedPayload = makePayloadLocalized(json, locale, global.fields);

  const deserializedPayload = deserializeMongoPayload(
    localizedPayload,
    global.fields,
  );

  // Flatten localized data for atomic updates in mongo
  const flattenedPayload = flatten(deserializedPayload);

  // Update document in MongoDB
  const client = await mongoClientPromise;
  try {
    await client.db().collection(globalKey).updateOne(
      {},
      {
        $set: flattenedPayload,
      },
      {
        upsert: true,
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
