import { Filter } from "mongodb";
import {
  ActionResult,
  CatalystConfig,
  CatalystDerivedField,
  CatalystField,
  CatalystFields,
  CatalystReferenceField,
  CatalystRichTextField,
  CatalystTextField
} from "../types";

export type CatalystDataObject<C extends CatalystConfig = CatalystConfig> =
  CatalystCollectionDataObject<C> & CatalystGlobalsDataObject<C>;

export type CatalystCollectionDataObject<C extends CatalystConfig> = {
  [K in keyof C["collections"]]: {
    findAsUser: CatalystFindDataFunction<C, K>;
    findOneAsUser: CatalystFindOneDataFunction<C, K>;
    find: CatalystFindDataFunction<C, K>;
    findOne: CatalystFindOneDataFunction<C, K>;
    create: CatalystCreateDataFunction<C, K>;
    updateOne: CatalystUpdateOneDataFunction<C, K>;
  };
};

export type CatalystGlobalsDataObject<C extends CatalystConfig> = {
  [K in keyof C["globals"]]: {
    getAsUser: CatalystGetDataFunction<C, K>;
    get: CatalystGetDataFunction<C, K>;
  };
};

type CatalystUpdateOneDataFunction<
  C extends CatalystConfig,
  K extends keyof C["collections"]
> = (
  id: string,
  data: Partial<ComputedCatalystFields<C, C["collections"][K]["fields"]>>
) => Promise<ActionResult>;

type CatalystCreateDataFunction<
  C extends CatalystConfig,
  K extends keyof C["collections"]
> = (
  data: ComputedCatalystFields<C, C["collections"][K]["fields"]>
) => Promise<ActionResult>;

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

export type ComputedCatalystFields<
  C extends CatalystConfig,
  F extends CatalystFields<C>
> = {
  [K in keyof F]: ComputedCatalystField<C, F[K]>;
};

type ComputedCatalystField<
  C extends CatalystConfig,
  F extends CatalystField<C>
> = WithCatalystOptionalCheck<
  F,
  F extends CatalystReferenceField<C>
    ? ComputedCatalystFields<C, C["collections"][F["collection"]]["fields"]>
    : F extends CatalystTextField
    ? string
    : F extends CatalystRichTextField
    ? string
    : F extends CatalystDerivedField
    ? any
    : never
>;

type WithCatalystOptionalCheck<
  F extends CatalystField,
  T
> = F["optional"] extends true ? T | undefined : T;

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
