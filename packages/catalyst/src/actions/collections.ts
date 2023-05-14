"use server";

import { ObjectId } from "mongodb";
import { catalystInstance } from "../config";
import mongoClientPromise from "../mongo";
import { transformUserPayload } from "./utils";
import { logInfo } from "../logger";
import { logError } from "../logger";
import { ActionResult } from "../types";

export async function createCollectionEntry(
  collectionName: string,
  payload: Record<string, unknown>
): Promise<ActionResult> {
  const collection = catalystInstance.config.collections[collectionName];

  if (!collection) {
    logError(`Creation failed: ollection '${collectionName}' does not exist`);

    return {
      success: false,
      error: {
        message: `Collection ${collectionName} does not exist`
      }
    };
  }

  const { doc, error, field } = await transformUserPayload(
    collection,
    payload,
    catalystInstance.config.i18n.defaultLocale
  );

  if (error) {
    logError(`Creation failed: user payload transformation error ${error}`);

    return {
      success: false,
      error: {
        message: error,
        field
      }
    };
  }

  const client = await mongoClientPromise;

  await client
    .db()
    .collection(collectionName)
    .insertOne(doc as any);

  logInfo(`Created collection entry in ${collectionName}.`);

  return {
    success: true
  };
}

export async function editCollectionEntry(
  {
    collectionName,
    docId
  }: {
    collectionName: string;
    docId: string;
  },
  edits: Record<string, unknown>,
  locale: string
): Promise<ActionResult> {
  const collection = catalystInstance.config.collections[collectionName];

  if (!collection) {
    logError(`Collection '${collectionName}' does not exist`);

    return {
      success: false,
      error: {
        message: `Collection ${collectionName} does not exist`
      }
    };
  }

  const { doc, error, field } = await transformUserPayload(
    collection,
    edits,
    locale
  );

  if (error) {
    logError(`User payload transformation failed: ${error}`);

    return {
      success: false,
      error: {
        message: error,
        field
      }
    };
  }

  const client = await mongoClientPromise;

  await client
    .db()
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(docId) }, { $set: doc });

  logInfo(`Edited collection entry in ${collectionName}.`);

  return {
    success: true
  };
}
