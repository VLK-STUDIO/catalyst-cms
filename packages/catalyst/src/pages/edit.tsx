import type {
  CatalystCollection,
  CatalystConfig,
  CatalystData,
} from "../types";
import { Form } from "../components/form/Form";
import { getFormFieldsFromCollection } from "../components/form/utils";
import { getLivePreviewUrlForDoc } from "../preview";

type Props<C extends CatalystConfig> = {
  i18n: C["i18n"];
  collection: CatalystCollection & {
    name: keyof C["collections"];
  };
  data: CatalystData<C>;
  docId: string;
  searchParams?: Record<string, string>;
};

export async function EditPage<C extends CatalystConfig>({
  collection,
  data,
  docId,
  searchParams,
  i18n,
}: Props<C>) {
  const doc = await data[collection.name].findOne(
    docId,
    searchParams && searchParams.locale
  );

  const fields = await getFormFieldsFromCollection(collection, doc);

  const previewUrl = collection.previewUrl
    ? getLivePreviewUrlForDoc(doc, collection.previewUrl)
    : undefined;

  return (
    <Form
      fields={fields}
      i18n={i18n}
      method="PATCH"
      endpoint={`/api/${collection.name as string}/${docId}`}
      submitText="Update"
      title={`EDIT ${collection.name as string}`}
      previewUrl={previewUrl}
      collectionName={collection.name as string}
    />
  );
}
