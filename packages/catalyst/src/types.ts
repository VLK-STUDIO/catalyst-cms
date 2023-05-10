import { AuthOptions } from "next-auth";
import { createCatalystAuthObject } from "./auth";
import { CatalystDataObject, ComputedCatalystFields } from "./data/types";

export type CatalystCms = {
  data: CatalystDataObject;
  auth: CatalystAuth;
};

export type UserCatalystConfig = Omit<
  Optional<CatalystConfig, "i18n">,
  "auth"
> & {
  auth: Optional<CatalystAuthConfig, "whitelist">;
};

export type CatalystConfig = {
  collections: {
    [K: string]: CatalystCollection<CatalystConfig>;
  };
  globals: {
    [K: string]: CatalystGlobal<CatalystConfig>;
  };
  i18n: {
    defaultLocale: string;
    locales: readonly string[];
  };
  auth: CatalystAuthConfig;
};

export type CatalystDataType<C extends CatalystConfig = CatalystConfig> =
  | CatalystCollection<C>
  | CatalystGlobal<C>;

export type CatalystCollection<C extends CatalystConfig = CatalystConfig> =
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

export type CatalystAuthConfig = {
  whitelist: {
    collection: string;
    field: string;
  };
  providers: AuthOptions["providers"];
};

export type CatalystAuth = ReturnType<typeof createCatalystAuthObject>;

type CatalystAccessControlFunction = (user: any) => boolean;

export type CatalystFields<C extends CatalystConfig> = {
  [K: string]: CatalystField<C>;
};

export type CatalystField<C extends CatalystConfig> = CatalystFieldBase &
  (
    | CatalystTextField
    | CatalystRichTextField
    | CatalystReferenceField<C>
    | CatalystSelectField
    | CatalystDerivedField
  );

export type CatalystDerivedField = CatalystFieldBase & {
  type: "derived";
  readonly getter: (
    param: Record<string, any>
  ) => Promise<string | number> | string | number;
};

export type CatalystSelectField = CatalystFieldBase & {
  type: "select";
  localized?: boolean;
  options: readonly { label: string; value: string }[];
};

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

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
