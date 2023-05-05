import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "../utils";
import { canUserUpdateDataType } from "../../access";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getComputedPreviewUrl } from "../../preview";
import { RouteProps } from "./types";

export async function EditCollectionRoute({
  session,
  params,
  config,
  cms,
  searchParams
}: RouteProps) {
  const [_, collectionName, docId] = params;

  const collection = config.collections[collectionName] || notFound();

  if (!canUserUpdateDataType(session, collection)) {
    redirect("/catalyst/forbidden");
  }

  const doc = await cms.data[collectionName].findOne({
    // @ts-ignore
    filters: {
      _id: {
        $eq: new ObjectId(docId)
      }
    },
    locale: searchParams ? searchParams.locale : config.i18n.defaultLocale
  });

  const fields = await getFormFieldsFromDataType(collection, doc);

  const previewUrl = collection.previewUrl
    ? getComputedPreviewUrl(collection.previewUrl, doc)
    : undefined;

  return (
    <Form
      fields={fields}
      i18n={config.i18n}
      method="PATCH"
      endpoint={`/api/collection/${collectionName}/${docId}`}
      submitText="Update"
      title={`EDIT ${collectionName}`}
      previewUrl={previewUrl}
      typeName={collectionName}
    />
  );
}
