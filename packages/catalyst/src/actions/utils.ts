import { ObjectId } from "mongodb";
import { flatten } from "flat";
import { CatalystFields, CatalystDataType } from "../types";

export async function transformUserPayload(
  dataType: CatalystDataType,
  doc: any,
  locale: string
) {
  const payloadWithDerivedFields = await getPayloadWithDerivedFields(
    dataType.fields,
    doc
  );

  const validationResult = validateDocForDataType(dataType, doc);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error,
      field: validationResult.field
    };
  }

  const localizedPayload = makePayloadLocalized(
    payloadWithDerivedFields,
    dataType.fields,
    locale
  );

  const deserializedPayload = deserializeMongoPayload(
    localizedPayload,
    dataType.fields
  );

  return {
    success: true,
    doc: flatten(deserializedPayload)
  };
}

/**
 * Applies the given locale to a payload
 * for every field that has `localized` set to `true`.
 *
 * @param payload The payload to localize
 * @param collectionFields The fields of the collection
 * @param locale The locale to apply
 * @returns The localized payload
 */
function makePayloadLocalized(
  payload: any,
  fields: CatalystFields,
  locale: string
) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      if ("localized" in fields[key]) {
        return [key, { [locale]: value }];
      }

      return [key, value];
    })
  );
}

async function getPayloadWithDerivedFields(
  fields: CatalystFields,
  payload: any
) {
  const derivedFields: Record<string, unknown> = {};

  await Promise.all(
    Object.entries(fields).map(async ([key, field]) => {
      if (field.type === "derived") {
        derivedFields[key] = await field.getter(payload);
      }
    })
  );

  return { ...payload, ...derivedFields };
}

/**
 * Deserializes a MongoDB document sent by client components
 * by converting all strings to ObjectIds to be stored in the DB.
 *
 * @param payload Anything with Object IDs
 * @param dataTypeFields A map of field names to their data types
 * @returns payload with Object IDs converted to strings
 */
function deserializeMongoPayload(payload: any, fields: CatalystFields) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => {
      const field = fields[key];

      if (field && field.type === "reference") {
        if (typeof value !== "string")
          throw new Error(
            `Expected a string for reference field '${key}', but got '${typeof value}'.`
          );

        return [key, new ObjectId(value)];
      }

      return [key, value];
    })
  );
}

function validateDocForDataType(
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
