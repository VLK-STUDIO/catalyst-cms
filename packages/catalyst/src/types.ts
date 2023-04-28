import { ObjectId } from "mongodb";
import { createCatalystAuthObject } from "./auth";

export type CatalystDataObject<C extends CatalystConfig> =
  CatalystCollectionDataObject<C["collections"]> &
    CatalystGlobalsDataObject<C["globals"]>;

export type CatalystCollectionDataObject<
  C extends CatalystConfig["collections"]
> = {
  [K in keyof C]: {
    findAsUser: () => Promise<ComputedCatalystFields<C[K]["fields"]>[]>;
    findOneAsUser: () => Promise<ComputedCatalystFields<C[K]["fields"]>>;
    find: () => Promise<ComputedCatalystFields<C[K]["fields"]>[]>;
    findOne: (
      id: string,
      locale?: string,
      options?: { delocalize: boolean }
    ) => Promise<ComputedCatalystFields<C[K]["fields"]>>;
  };
};

export type CatalystGlobalsDataObject<C extends CatalystConfig["globals"]> = {
  [K in keyof C]: {
    getAsUser: () => Promise<ComputedCatalystFields<C[K]["fields"]>>;
    get: () => Promise<ComputedCatalystFields<C[K]["fields"]>>;
  };
};

export type CatalystConfig = {
  collections: {
    users: CatalystCollection;
  } & {
    [K: string]: CatalystCollection;
  };
  globals: {
    [K: string]: CatalystGlobal;
  };
  i18n: {
    defaultLocale: string;
    locales: string[];
  };
};

export type CatalystDataType = CatalystCollection | CatalystGlobal;

export type CatalystCollection = CatalystBaseDataType & {
  access?: {
    read?: CatalystAccessControlFunction;
    update?: CatalystAccessControlFunction;
    delete?: CatalystAccessControlFunction;
    create?: CatalystAccessControlFunction;
  };
  hooks?: {
    beforeCreate?: (data: any) => any;
    beforeUpdate?: (data: any) => any;
    beforeDelete?: (data: any) => any;
  };
};

export type CatalystGlobal = CatalystBaseDataType & {
  access?: {
    read?: CatalystAccessControlFunction;
    update?: CatalystAccessControlFunction;
  };
  hooks?: {
    beforeUpdate?: (data: any) => any;
  };
};

export type CatalystBaseDataType = {
  label: string;
  previewUrl?: string;
  fields: CatalystFields;
};

type CatalystAccessControlFunction = (user: any) => boolean;

type ComputedCatalystFields<T extends CatalystFields> = {
  [K in keyof T]: K extends "_id"
    ? ObjectId
    : T[K] extends "text"
    ? string
    : T[K] extends "richtext"
    ? string
    : never;
};

export type CatalystFields = {
  [K: string]: CatalystField;
};

export type CatalystField = CatalystFieldBase &
  (CatalystTextField | CatalystRichTextField | CatalystReferenceField);

type CatalystTextField = CatalystFieldBase & {
  type: "text";
  localized?: boolean;
  hooks?: FieldHooks<string>;
};

type CatalystRichTextField = CatalystFieldBase & {
  type: "richtext";
  localized?: boolean;
  hooks?: FieldHooks<string>;
};

type CatalystReferenceField = {
  label: string;
  type: "reference";
  collection: string;
  exposedColumn?: string;
};

type CatalystFieldBase = {
  label: string;
};

type FieldHooks<T> = {
  beforeCreate?: (value: T) => T | Promise<T>;
  beforeUpdate?: (value: T) => T | Promise<T>;
};

export type CatalystAuth = ReturnType<typeof createCatalystAuthObject>;
