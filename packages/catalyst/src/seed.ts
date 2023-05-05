import { logInfo } from "./logger";
import mongoClientPromise from "./mongo";

export type CatalystSeed = Record<string, any | any[]>;

let seeded = false;

export const seedDocuments = async (seed: CatalystSeed) => {
  if (seeded) {
    return;
  }

  logInfo("Checking seeds...");

  for (const [typeKey, type] of Object.entries(seed)) {
    const client = await mongoClientPromise;

    const collection = client.db().collection(typeKey);

    const count = await collection.countDocuments();

    if (count === 0) {
      logInfo(`Found no documents for ${typeKey}. Seeding...`);

      try {
        if (Array.isArray(type)) {
          await collection.insertMany(type);
        } else {
          await collection.insertOne(type);
        }
      } catch {
        logInfo(`Failed to seed ${typeKey}.`);
      }
    } else {
      logInfo(`Found ${count} documents for ${typeKey}. Skipping seeding.`);
    }
  }

  seeded = true;
};
