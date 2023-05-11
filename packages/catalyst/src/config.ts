import { CatalystCms, UserCatalystConfig } from "./types";
import { createDashboard } from "./dashboard";
import { createCatalystAuthObject } from "./auth";
import { createCatalystDataObject } from "./data";
import { createRootEndpoint } from "./endpoints";

export function createCatalyst<const C extends UserCatalystConfig>(
  userConfig: C
) {
  const config = getConfigWithDefaults(userConfig);

  const auth = createCatalystAuthObject(config.auth);

  const data = createCatalystDataObject(config, auth);

  const rootEndpoint = createRootEndpoint(config, auth);

  const rootPage = createDashboard({ data, auth } as CatalystCms, config);

  return {
    rootEndpoint,
    rootPage,
    data,
    auth
  };
}

function getConfigWithDefaults<const C extends UserCatalystConfig>(config: C) {
  return {
    ...config,
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
      ...(config.i18n ?? {})
    }
  };
}
