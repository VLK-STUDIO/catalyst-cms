import { headers } from "next/headers";

export const getLivePreviewDataForCollection = (typeName: string) => {
  const data = headers().get(`x-catalyst-live-preview-${typeName}`);

  if (!data) {
    return null;
  }

  return JSON.parse(decodeURIComponent(data));
};

export function getComputedPreviewUrl(url: string, params: any): string {
  let computedUrl = url;

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" || typeof value === "number") {
      computedUrl = computedUrl.replace(`:${key}`, String(value));
    }
  }

  return computedUrl;
}
