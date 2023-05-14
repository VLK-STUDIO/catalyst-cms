"use server";

import { catalystInstance } from "../config";
import mongoClientPromise from "../mongo";
import { transformUserPayload } from "./utils";
import { logInfo } from "../logger";
import { logError } from "../logger";
import { ActionResult } from "../types";

export async function editGlobal(
  globalName: string,
  edits: Record<string, unknown>,
  locale: string
): Promise<ActionResult> {
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

  const { doc, success, error, field } = await transformUserPayload(
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

  await client.db().collection(globalName).updateOne({}, { $set: doc });

  logInfo(`Edited global ${globalName}.`);

  return {
    success: true
  };
}
