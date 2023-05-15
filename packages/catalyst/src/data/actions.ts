import { catalystInstance } from "../config";
import { ActionResult } from "../types";
import mongoClientPromise from "../mongo";
import { transformUserPayload } from "./utils";
import { logInfo } from "../logger";
import { logError } from "../logger";
import { ObjectId } from "mongodb";
import { flatten } from "lodash";

export function createCollectionEntryCreationAction(collectionName: string) {
  return async function createCollectionEntry(
    data: Record<string, unknown>
  ): Promise<ActionResult> {
    "use server";

    const collection = catalystInstance.config.collections[collectionName];

    if (!collection) {
      logError(
        `Creation failed: collection '${collectionName}' does not exist`
      );

      return {
        success: false,
        error: {
          message: `Collection ${collectionName} does not exist`
        }
      };
    }

    const { doc, error, field } = await transformUserPayload(
      collection,
      data,
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
  };
}

export function createCollectionEntryUpdateAction(collectionName: string) {
  return async function editCollectionEntry(
    docId: string,
    edits: Record<string, unknown>,
    locale: string
  ): Promise<ActionResult> {
    "use server";

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
      .updateOne({ _id: new ObjectId(docId) }, { $set: flatten(doc as any) });

    logInfo(`Edited collection entry in ${collectionName}.`);

    return {
      success: true
    };
  };
}

export function createGlobalUpdateAction(globalName: string) {
  return async function editGlobal(
    edits: Record<string, unknown>,
    locale: string
  ): Promise<ActionResult> {
    "use server";

    const collection = catalystInstance.config.globals[globalName];

    if (!collection) {
      logError(`Global update error: global '${globalName}' does not exist`);

      return {
        success: false,
        error: {
          message: `Global ${globalName} does not exist`
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
      .collection(globalName)
      .updateOne({}, { $set: flatten(doc as any) });

    logInfo(`Edited global ${globalName}.`);

    return {
      success: true
    };
  };
}
