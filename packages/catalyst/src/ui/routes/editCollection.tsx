import { Form } from "../components/_shared/Form";
import { getFormFieldsFromDataType } from "../utils";
import { canUserUpdateDataType } from "../../access";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getComputedPreviewUrl } from "../../preview";
import { RouteProps } from "./types";
import { createCollectionEntryUpdateAction } from "../../data/actions";

export async function EditCollectionRoute({
  session,
  params,
  config,
  cms,
  searchParams
}: RouteProps) {
  const [_, collectionName, docId] = params;

  const locale = (searchParams ?? {}).locale ?? config.i18n.defaultLocale;

  const collection = config.collections[collectionName] || notFound();

  if (!canUserUpdateDataType(session, collection)) {
    redirect("/catalyst/forbidden");
  }

  const doc = await cms.data[collectionName].findOne({
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

  const updateAction = createCollectionEntryUpdateAction(collectionName);

  const action = async (edits: Record<string, unknown>) => {
    "use server";

    const [_, __, docId] = params;

    return await updateAction(docId, edits, locale);
  };

  return (
    <Form
      action={action}
      fields={fields}
      i18n={config.i18n}
      submitText="Update"
      title={`EDIT ${collectionName}`}
      previewUrl={previewUrl}
      typeName={collectionName}
    />
  );
}
