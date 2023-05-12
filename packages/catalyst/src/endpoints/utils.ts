import { CatalystConfig, CatalystDataType, CatalystFields } from "../types";

export const getPayloadWithDerivedFields = async (
  fields: CatalystFields<CatalystConfig>,
  json: any
) => {
  const derivedFields: Record<string, unknown> = {};
  await Promise.all(
    Object.entries(fields).map(async ([key, field]) => {
      if (field.type === "derived") {
        derivedFields[key] = await field.getter(json);
      }
    })
  );

  return { ...json, ...derivedFields };
};

export function validateDocForDataType(
  dataType: CatalystDataType,
  doc: unknown
):
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
      field?: string;
    } {
  if (typeof doc !== "object" || doc === null) {
    return {
      success: false,
      error: "Document must be an object"
    };
  }

  for (const [key, field] of Object.entries(dataType.fields).filter(
    ([_, field]) => field.type !== "derived"
  )) {
    if (doc.hasOwnProperty(key) === false) {
      if (!field.optional) {
        return {
          success: false,
          error: "This field is required:" + key,
          field: key
        };
      }
    }

    if (field.validate) {
      const value = (doc as any)[key];
      const validationResult = field.validate(value);

      if (typeof validationResult === "string") {
        return {
          success: false,
          error: validationResult,
          field: key
        };
      }
    }
  }

  return {
    success: true
  };
}
