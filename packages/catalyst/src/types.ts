import { ObjectId } from "mongodb";
import { createCatalystAuthObject } from "./auth";

export type UserCatalystConfig = Omit<CatalystConfig, "collections"> & {
  collections?: CatalystConfig["collections"];
};

export type CatalystConfig = {
  collections: {
    [K: string]: CatalystCollection;
  };
  globals: {
    [K: string]: CatalystGlobal;
  };
  i18n: {
    defaultLocale: string;
    locales: string[];
  };
  auth?: {
    fields?: {
      [K: string]: CatalystField;
    };
  };
};

export type CatalystDataType = CatalystCollection | CatalystGlobal;

export type CatalystGlobal = {
  fields: Record<string, CatalystField>;
  label: string;
  previewUrl?: string;
};

export type CatalystCollection = {
  fields: Record<string, CatalystField>;
  label: string;
  previewUrl?: string;
};

export type CatalystField = CatalystFieldBase &
  (CatalystTextField | CatalystRichTextField | CatalystReferenceField);

export type CatalystFieldBase = {
  label: string;
  hooks?: {
    beforeCreate?: (value: any) => any | Promise<any>;
    beforeUpdate?: (value: any) => any | Promise<any>;
  };
};

export type CatalystTextField = CatalystFieldBase & {
  type: "text";
  localized?: boolean;
};

export type CatalystRichTextField = CatalystFieldBase & {
  type: "richtext";
  localized?: boolean;
};

export type CatalystReferenceField = {
  label: string;
  type: "reference";
  collection: string;
  exposedColumn?: string;
};

export type ComputedCollectionFields<T extends CatalystCollection> = {
  [K in keyof T["fields"] | "_id"]: K extends "_id"
    ? ObjectId
    : T["fields"][K] extends "text"
    ? string
    : never;
};

export type CatalystDataObject<C extends CatalystConfig> =
  CatalystCollectionDataObject<C["collections"]> &
    CatalystGlobalsDataObject<C["globals"]>;

export type CatalystCollectionDataObject<
  C extends CatalystConfig["collections"]
> = {
  [K in keyof C]: {
    find: () => Promise<ComputedCollectionFields<C[K]>[]>;
    findOne: (
      id: string,
      locale?: string,
      options?: { delocalize: boolean }
    ) => Promise<ComputedCollectionFields<C[K]>>;
  };
};

export type CatalystGlobalsDataObject<C extends CatalystConfig["globals"]> = {
  [K in keyof C]: {
    get: () => Promise<ComputedCollectionFields<C[K]>>;
  };
};

export type CatalystAuth = ReturnType<typeof createCatalystAuthObject>;
