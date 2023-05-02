import type { CatalystConfig } from "../../types";
import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "./utils";
import { CatalystCollection } from "../../types";
import { Session } from "next-auth";
import { canUserUpdateDataType } from "../../access";
import { redirect } from "next/navigation";
import { CatalystDataObject } from "../../data/types";
import { ObjectId } from "mongodb";
import { getComputedPreviewUrl } from "../../preview";

type Props<C extends CatalystConfig> = {
  i18n: C["i18n"];
  data: CatalystDataObject<C>;
  searchParams?: Record<string, string>;
  collection: CatalystCollection<C>;
  name: string;
  docId: string;
  session: Session;
};

export async function EditCollectionPage<C extends CatalystConfig>({
  collection,
  name,
  data,
  searchParams,
  i18n,
  docId,
  session,
}: Props<C>) {
  if (!canUserUpdateDataType(session, collection)) {
    redirect("/catalyst/forbidden");
  }

  const doc = await data[name].findOne({
    // @ts-ignore
    filters: {
      _id: {
        $eq: new ObjectId(docId),
      },
    },
    locale: searchParams ? (searchParams.locale as string) : i18n.defaultLocale,
  });

  const fields = await getFormFieldsFromDataType(collection, doc);

  const previewUrl = collection.previewUrl
    ? getComputedPreviewUrl(collection.previewUrl, doc)
    : undefined;

  return (
    <Form
      fields={fields}
      i18n={i18n}
      method="PATCH"
      endpoint={`/api/collection/${name}/${docId}`}
      submitText="Update"
      title={`EDIT ${name}`}
      previewUrl={previewUrl}
      typeName={name as string}
    />
  );
}
