import { notFound, redirect } from "next/navigation";
import { canUserUpdateDataType } from "../../access";
import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "../utils";
import { RouteProps } from "./types";

export async function EditGlobalRoute({
  config,
  cms,
  session,
  params
}: RouteProps) {
  const [_, globalName] = params;

  const global = config.globals[globalName] || notFound();

  if (!canUserUpdateDataType(session, global)) {
    redirect("/catalyst/forbidden");
  }

  const { previewUrl } = global;

  const doc = await cms.data[globalName].get().catch(() => undefined);

  const fields = await getFormFieldsFromDataType(global, doc);

  return (
    <Form
      fields={fields}
      i18n={config.i18n}
      method="POST"
      endpoint={`/api/global/${globalName}`}
      submitText={doc ? "Update" : "Create"}
      title={`EDIT ${globalName}`}
      previewUrl={previewUrl}
      typeName={globalName}
    />
  );
}
