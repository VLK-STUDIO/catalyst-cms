import type {
  CatalystConfig,
  CatalystDataObject,
  CatalystGlobal,
} from "../types";
import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "../components/form/utils";
import { getPreviewUrlForDoc } from "../preview";

type Props<C extends CatalystConfig> = {
  i18n: C["i18n"];
  data: CatalystDataObject<C>;
  searchParams?: Record<string, string>;
  global: CatalystGlobal;
  name: string;
};

export async function EditGlobalPage<C extends CatalystConfig>({
  global,
  name,
  data,
  i18n,
}: Props<C>) {
  const { previewUrl } = global;

  const doc = await data[name].get().catch(() => undefined);

  const fields = await getFormFieldsFromDataType(global, doc);

  return (
    <Form
      fields={fields}
      i18n={i18n}
      method="POST"
      endpoint={`/api/global/${name}`}
      submitText={doc ? "Update" : "Create"}
      title={`EDIT ${name}`}
      previewUrl={previewUrl && getPreviewUrlForDoc(doc, previewUrl)}
      typeName={name as string}
    />
  );
}
