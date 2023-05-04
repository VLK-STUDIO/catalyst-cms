import { CatalystConfig, CatalystFields } from "../types";

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
