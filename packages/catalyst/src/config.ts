import deepmerge from "deepmerge";
import { CatalystCms, CatalystConfig } from "./types";
import { createDashboard } from "./dashboard";
import { createCatalystAuthObject } from "./auth";
import { createCatalystDataObject } from "./data";
import { createRootEndpoint } from "./endpoints";
import { CatalystSeed, seedDocuments } from "./seed";

export function createCatalyst<const C extends CatalystConfig>(
  userConfig: C,
  seed?: CatalystSeed
) {
  if (seed) {
    // This is a promise, but we can't really wait for it to finish.
    // Let's just hope it finishes before the server starts.
    seedDocuments(seed);
  }

  const config = getConfigWithDefaults(userConfig) as unknown as C;

  const data = createCatalystDataObject(config);

  const auth = createCatalystAuthObject();

  const rootEndpoint = createRootEndpoint(config, auth);

  const rootPage = createDashboard({ data, auth } as CatalystCms, config);

  return {
    rootEndpoint,
    rootPage,
    data,
    auth
  };
}

function getConfigWithDefaults<const C extends CatalystConfig>(config: C) {
  return deepmerge(
    {
      collections: {
        users: {
          label: "Users",
          fields: {
            email: {
              type: "text",
              label: "Email"
            }
          }
        }
      }
    },
    config
  );
}
