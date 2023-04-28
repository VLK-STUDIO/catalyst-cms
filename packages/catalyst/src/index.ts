import { CatalystConfig } from "./types";
import { createRootPage } from "./ui/pages/base";
import { createCatalystAuthObject } from "./auth";
import { createCatalystDataObject } from "./data";
import { createRootEndpoint } from "./endpoints";

export function createCatalyst<C extends CatalystConfig>(userConfig: C) {
  const config = getConfigWithDefaults(userConfig);

  const data = createCatalystDataObject(config);

  const auth = createCatalystAuthObject();

  const rootEndpoint = createRootEndpoint(config);

  const rootPage = createRootPage(config, data, auth);

  return {
    rootEndpoint,
    rootPage,
    data,
    auth,
  };
}

function getConfigWithDefaults<C extends CatalystConfig>(config: C) {
  return {
    ...config,
    collections: {
      ...config.collections,
      users: {
        label: "Users",
        fields: {
          email: {
            type: "text",
            label: "Email",
          },
          ...(config.collections
            ? config.collections.users
              ? config.collections.users
              : {}
            : {}),
        },
      },
    },
  };
}
