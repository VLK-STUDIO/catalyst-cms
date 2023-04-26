import { headers } from "next/headers";

export const getLivePreviewDataForCollection = (typeName: string) => {
  const data = headers().get(`x-catalyst-live-preview-${typeName}`);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};
