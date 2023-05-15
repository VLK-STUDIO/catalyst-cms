import { createCatalystAuthObject } from "./auth";
import { CatalystDataObject } from "./data/types";
import { Provider } from "next-auth/providers";

export type CatalystCms = {
  data: CatalystDataObject<any>;
  auth: CatalystAuth;
  config: CatalystConfig;
};

export type UserCatalystConfig = Optional<CatalystConfig, "i18n">;

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

export type CatalystAuthConfig = {
  whitelist: {
    collection: string;
    field: string;
  };
  providers: readonly Provider[];
};

export type CatalystAuth = ReturnType<typeof createCatalystAuthObject>;

export type CatalystFields<C extends CatalystConfig = CatalystConfig> = {
  [K: string]: CatalystField<C>;
};

export type CatalystField<C extends CatalystConfig = CatalystConfig> =
  CatalystFieldBase &
    (
      | CatalystTextField
      | CatalystRichTextField
      | CatalystReferenceField
      | CatalystSelectField
      | CatalystDerivedField
    );

export type CatalystDerivedField = CatalystFieldBase & {
  type: "derived";
  readonly getter: (
    param: Record<string, any>
  ) => Promise<string | number> | string | number;
  validate?: CatalystFieldValidationFunction<any>;
};

type CatalystSelectField = CatalystFieldBase & {
  type: "select";
  localized?: boolean;
  options: readonly { label: string; value: string }[];
  validate?: CatalystFieldValidationFunction<string>;
};

export type CatalystTextField = CatalystFieldBase & {
  type: "text";
  localized?: boolean;
  hooks?: FieldHooks<string>;
  validate?: CatalystFieldValidationFunction<string>;
};

export type CatalystRichTextField = CatalystFieldBase & {
  type: "richtext";
  localized?: boolean;
  hooks?: FieldHooks<string>;
  validate?: CatalystFieldValidationFunction<string>;
};

export type CatalystReferenceField<C extends CatalystConfig = CatalystConfig> =
  CatalystFieldBase & {
    type: "reference";
    collection: keyof C["collections"];
    exposedColumn?: string;
    validate?: CatalystFieldValidationFunction<any>;
  };

export type ActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: {
        message: string;
        field?: string;
      };
    };

type CatalystGlobal<C extends CatalystConfig> = CatalystBaseDataType<C> & {
  access?: {
    read?: CatalystAccessControlFunction;
    update?: CatalystAccessControlFunction;
  };
  hooks?: {
    beforeUpdate?: (data: any) => any;
  };
};

type CatalystBaseDataType<C extends CatalystConfig> = {
  label: string;
  previewUrl?: string;
  fields: CatalystFields<C>;
};

type CatalystAccessControlFunction = (user: any) => boolean;

type CatalystFieldBase = {
  label: string;
  optional?: boolean;
  exposed?: boolean;
};

type CatalystFieldValidationFunction<T> = (
  value: T
) => string | false | null | undefined;

type FieldHooks<T> = {
  beforeCreate?: (value: T) => T | Promise<T>;
  beforeUpdate?: (value: T) => T | Promise<T>;
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
