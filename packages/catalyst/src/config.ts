import {
  CatalystCms,
  CatalystConfig,
  CatalystFields,
  UserCatalystConfig
} from "./types";
import { createDashboard } from "./ui";
import { createCatalystAuthObject } from "./auth";
import { createCatalystDataObject } from "./data";
import { createRootEndpoint } from "./endpoint";

/*
 * Singleton to hold reference to the catalyst
 * object outside the main closure.
 */
export let catalystInstance: CatalystCms;

/**
 * Main library entry point. Creates a Catalyst CMS object.
 *
 * @param userConfig Minimal configuration object for Catalyst CMS
 * @returns A Catalyst CMS object
 */
export function createCatalyst<const C extends UserCatalystConfig>(
  userConfig: C
) {
  const config = getConfigWithDefaults(userConfig);

  const auth = createCatalystAuthObject(config.auth);

  const data = createCatalystDataObject(config, auth);

  const rootEndpoint = createRootEndpoint(auth);

  const rootPage = createDashboard({ data, auth } as CatalystCms, config);

  catalystInstance = {
    data,
    auth,
    config
  };

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
    collections: getCollectionsWithDefaults(config.collections),
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
      ...(config.i18n ?? {})
    }
  };
}

function getCollectionsWithDefaults(
  collections: CatalystConfig["collections"]
) {
  return Object.entries(collections).reduce((acc, [key, collection]) => {
    return {
      ...acc,
      [key]: {
        ...collection,
        fields: getFieldsWithDefaults(collection.fields)
      }
    };
  }, {});
}

function getFieldsWithDefaults(fields: CatalystFields) {
  return Object.entries(fields).reduce((acc, [key, field]) => {
    if (field.exposed === undefined) {
      return {
        ...acc,
        [key]: {
          ...field,
          exposed: true
        }
      };
    }

    return acc;
  }, {});
}
