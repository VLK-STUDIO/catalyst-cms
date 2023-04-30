import { createCatalystAuthObject } from "./auth";

export type CatalystConfig = {
  collections: {
    users: CatalystCollection<CatalystConfig>;
  } & {
    [K: string]: CatalystCollection<CatalystConfig>;
  };
  globals: {
    [K: string]: CatalystCollection<CatalystConfig>;
  };
  i18n: {
    defaultLocale: string;
    locales: string[];
  };
};

export type CatalystDataType<C extends CatalystConfig> =
  | CatalystCollection<C>
  | CatalystGlobal<C>;

export type CatalystCollection<C extends CatalystConfig> =
  CatalystBaseDataType<C> & {
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

export type CatalystGlobal<C extends CatalystConfig> =
  CatalystBaseDataType<C> & {
    access?: {
      read?: CatalystAccessControlFunction;
      update?: CatalystAccessControlFunction;
    };
    hooks?: {
      beforeUpdate?: (data: any) => any;
    };
  };

export type CatalystBaseDataType<C extends CatalystConfig> = {
  label: string;
  previewUrl?: string;
  fields: CatalystFields<C>;
};

export type CatalystAuth = ReturnType<typeof createCatalystAuthObject>;

type CatalystAccessControlFunction = (user: any) => boolean;

export type CatalystFields<C extends CatalystConfig> = {
  [K: string]: CatalystField<C>;
};

export type CatalystField<C extends CatalystConfig> = CatalystFieldBase &
  (CatalystTextField | CatalystRichTextField | CatalystReferenceField<C>);

export type CatalystTextField = CatalystFieldBase & {
  type: "text";
  localized?: boolean;
  hooks?: FieldHooks<string>;
};

export type CatalystRichTextField = CatalystFieldBase & {
  type: "richtext";
  localized?: boolean;
  hooks?: FieldHooks<string>;
};

export type CatalystReferenceField<C extends CatalystConfig> =
  CatalystFieldBase & {
    type: "reference";
    collection: keyof C["collections"];
    exposedColumn?: string;
  };

type CatalystFieldBase = {
  label: string;
};

type FieldHooks<T> = {
  beforeCreate?: (value: T) => T | Promise<T>;
  beforeUpdate?: (value: T) => T | Promise<T>;
};
