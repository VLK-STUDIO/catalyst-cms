import { CatalystAuth, CatalystConfig } from "../types";
import {
  CatalystCollectionDataObject,
  CatalystDataObject,
  CatalystGlobalsDataObject
} from "./types";
import {
  createCollectionEntryCreationAction,
  createCollectionEntryUpdateAction,
  createGlobalUpdateAction
} from "./actions";
import {
  createFindAsUserFunction,
  createFindFunction,
  createFindOneAsUserFunction,
  createFindOneFunction,
  createGetAsUserFunction,
  createGetFunction
} from "./queries";

export function createCatalystDataObject<const C extends CatalystConfig>(
  config: C,
  auth: CatalystAuth
): CatalystDataObject<C> {
  const { collections, globals } = config;

  const collectionsDataObject = Object.keys(collections).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        findAsUser: createFindAsUserFunction({ config, auth }, key),
        findOneAsUser: createFindOneAsUserFunction({ config, auth }, key),
        find: createFindFunction(config, key),
        findOne: createFindOneFunction(config, key),
        create: createCollectionEntryCreationAction(key),
        updateOne: createCollectionEntryUpdateAction(key)
      }
    };
  }, {} as CatalystCollectionDataObject<C>);

  const globalsDataObject = Object.keys(globals).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        getAsUser: createGetAsUserFunction({ config, auth }, key),
        get: createGetFunction(config, key),
        update: createGlobalUpdateAction(key)
      }
    };
  }, {} as CatalystGlobalsDataObject<C>);

  return {
    ...collectionsDataObject,
    ...globalsDataObject
  };
}
