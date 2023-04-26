import type {
  CatalystCollection,
  CatalystConfig,
  CatalystDataObject,
} from "../types";
import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "../components/form/utils";

type Props<C extends CatalystConfig> = {
  i18n: C["i18n"];
  data: CatalystDataObject<C>;
  searchParams?: Record<string, string>;
  collection: CatalystCollection;
  name: string;
  docId: string;
};

export async function EditCollectionPage<C extends CatalystConfig>({
  collection,
  name,
  data,
  searchParams,
  i18n,
  docId,
}: Props<C>) {
  const doc = await data[name].findOne(
    docId,
    searchParams && searchParams.locale
  );

  const fields = await getFormFieldsFromDataType(collection, doc);

  return (
    <Form
      fields={fields}
      i18n={i18n}
      method="PATCH"
      endpoint={`/api/collection/${name}/${docId}`}
      submitText="Update"
      title={`EDIT ${name}`}
      previewUrl={collection.previewUrl}
      typeName={name as string}
    />
  );
}
