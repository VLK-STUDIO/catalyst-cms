import {
  CatalystCms,
  CatalystConfig,
  CatalystFields,
  UserCatalystConfig
} from "./types";
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
  const updatedConfigCollections = normalizeCollections(config);
  return {
    ...config,
    collections: updatedConfigCollections,
    i18n: {
      defaultLocale: "en",
      locales: ["en"],
      ...(config.i18n ?? {})
    }
  };
}

function normalizeCollections(config: UserCatalystConfig) {
  const updatedCollectionFields = Object.entries(config.collections).reduce(
    (acc, [key, collection]) => {
      return {
        ...acc,
        [key]: {
          ...collection,
          fields: getFieldWithExposed(collection.fields)
        }
      };
    },
    {}
  );
  return updatedCollectionFields;
}

function getFieldWithExposed(fields: CatalystFields<CatalystConfig>) {
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
    return {
      ...acc
    };
  }, {});
}
