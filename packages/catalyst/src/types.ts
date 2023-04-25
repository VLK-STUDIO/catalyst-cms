import { ObjectId } from "mongodb";
import { createCatalystAuthObject } from "./auth";

export type CatalystConfig = {
  collections: {
    [K: string]: CatalystCollection;
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
  localised?: boolean;
};

export type CatalystRichTextField = CatalystFieldBase & {
  type: "richtext";
  localised?: boolean;
};

export type CatalystReferenceField = {
  label: string;
  type: "reference";
  collection: string;
  exposedColumn?: string;
};

export type SerializableCatalystConfig = Omit<CatalystConfig, "collections"> & {
  collections: Record<string, SerializableCatalystCollection>;
};

export type SerializableCatalystCollection = Omit<
  CatalystCollection,
  "fields"
> & {
  fields: Record<string, SerializableCatalystField>;
};

export type SerializableCatalystField = Omit<CatalystField, "schema">;

export type ComputedCollectionFields<T extends CatalystCollection> = {
  [K in keyof T["fields"] | "_id"]: K extends "_id"
    ? ObjectId
    : T["fields"][K] extends "text"
    ? string
    : never;
};

export type CatalystData<C extends CatalystConfig> = Record<
  keyof C["collections"],
  {
    find: () => Promise<
      ComputedCollectionFields<C["collections"][keyof C["collections"]]>[]
    >;
    findOne: (
      id: string,
      locale?: string,
      options?: {
        delocalise?: boolean;
      }
    ) => Promise<
      ComputedCollectionFields<C["collections"][keyof C["collections"]]>
    >;
  }
>;

export type CatalystAuth = ReturnType<typeof createCatalystAuthObject>;
