import { CatalystConfig } from "./types";
import { createRootPage } from "./ui/pages/base";
import { createCatalystAuthObject } from "./auth";
import { createCatalystDataObject } from "./data";
import { createRootEndpoint } from "./endpoints";
import deepmerge from "deepmerge";
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

  const config = getConfigWithDefaults(userConfig);

  const data = createCatalystDataObject(config);

  const auth = createCatalystAuthObject();

  const rootEndpoint = createRootEndpoint(config, auth);

  const rootPage = createRootPage(config, data, auth);

  return {
    rootEndpoint,
    rootPage,
    data,
    auth
  };
}

function getConfigWithDefaults<C extends CatalystConfig>(config: C) {
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
  ) as unknown as C & {
    collections: {
      users: C["collections"]["users"] & {
        fields: {
          email: {
            type: "text";
            label: string;
          };
        };
      };
    };
  };
}
