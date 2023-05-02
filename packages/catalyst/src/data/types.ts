import { Filter } from "mongodb";
import {
  CatalystConfig,
  CatalystReferenceField,
  CatalystRichTextField,
  CatalystTextField,
} from "../types";

export type CatalystDataObject<C extends CatalystConfig> =
  CatalystCollectionDataObject<C> & CatalystGlobalsDataObject<C>;

export type CatalystCollectionDataObject<C extends CatalystConfig> = {
  [K in keyof C["collections"]]: {
    findAsUser: CatalystFindDataFunction<C, K>;
    findOneAsUser: CatalystFindOneDataFunction<C, K>;
    find: CatalystFindDataFunction<C, K>;
    findOne: CatalystFindOneDataFunction<C, K>;
  };
};

export type CatalystGlobalsDataObject<C extends CatalystConfig> = {
  [K in keyof C["globals"]]: {
    getAsUser: CatalystGetDataFunction<C, K>;
    get: CatalystGetDataFunction<C, K>;
  };
};

export type CatalystFindDataFunction<
  C extends CatalystConfig,
  K extends keyof C["collections"]
> = (
  options?: QueryOptions<
    ComputedCatalystFields<C, C["collections"][K]["fields"]>
  >
) => Promise<
  (ComputedCatalystFields<C, C["collections"][K]["fields"]> & { _id: string })[]
>;

export type CatalystFindOneDataFunction<
  C extends CatalystConfig,
  K extends keyof C["collections"]
> = (
  options: Omit<
    WithRequired<
      QueryOptions<ComputedCatalystFields<C, C["collections"][K]["fields"]>>,
      "filters"
    >,
    "limit"
  >
) => Promise<
  ComputedCatalystFields<C, C["collections"][K]["fields"]> & { _id: string }
>;

export type CatalystGetDataFunction<
  C extends CatalystConfig,
  K extends keyof C["globals"]
> = (
  options?: Omit<
    QueryOptions<ComputedCatalystFields<C, C["globals"][K]["fields"]>>,
    "limit"
  >
) => Promise<ComputedCatalystFields<C, C["globals"][K]["fields"]>>;

type ComputedCatalystFields<
  C extends CatalystConfig,
  F extends C["collections"][string]["fields"] | C["globals"][string]["fields"]
> = {
  [K in keyof F]: F[K] extends CatalystReferenceField<C>
    ? ComputedCatalystFields<C, C["collections"][F[K]["collection"]]["fields"]>
    : F[K] extends CatalystTextField
    ? string
    : F[K]["type"] extends CatalystRichTextField
    ? string
    : never;
};

export type QueryOptions<T extends Record<string, any>> = {
  include?: Array<keyof T>;
  filters?: Filter<T>;
  locale?: string;
  delocalize?: boolean;
  limit?: number;
  autopopulate?: boolean;
};

// Utility type to make certain fields required
type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
