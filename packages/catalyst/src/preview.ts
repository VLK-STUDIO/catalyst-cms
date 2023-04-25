import { headers } from "next/headers";

export const getLivePreviewUrlForDoc = (
  doc: any,
  unparsedPreviewUrl: string
) => {
  const previewUrl = unparsedPreviewUrl.replace(
    /\/:([a-zA-Z0-9_]+)/g,
    (match, p1) => {
      return doc[p1];
    }
  );

  return previewUrl;
};

export const getLivePreviewDataForCollection = (collection: string) => {
  const data = headers().get(`x-catalyst-live-preview-${collection}`);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};
