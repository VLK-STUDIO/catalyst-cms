import { notFound, redirect } from "next/navigation";
import { canUserUpdateDataType } from "../../access";
import { Form } from "../components/_shared/Form";
import { getFormFieldsFromDataType } from "../utils";
import { RouteProps } from "./types";
import { editGlobal } from "../../actions/globals";

export async function EditGlobalRoute({
  config,
  cms,
  session,
  params,
  searchParams
}: RouteProps) {
  const [_, globalName] = params;

  const locale = (searchParams ?? {}).locale ?? config.i18n.defaultLocale;

  const global = config.globals[globalName] || notFound();

  if (!canUserUpdateDataType(session, global)) {
    redirect("/catalyst/forbidden");
  }

  const { previewUrl } = global;

  const doc = await cms.data[globalName].get().catch(() => undefined);

  const fields = await getFormFieldsFromDataType(global, doc);

  const action = async (edits: Record<string, unknown>) => {
    "use server";

    const [_, globalName] = params;

    return await editGlobal(globalName, edits, locale);
  };

  return (
    <Form
      fields={fields}
      i18n={config.i18n}
      action={action}
      submitText={doc ? "Update" : "Create"}
      title={`EDIT ${globalName}`}
      previewUrl={previewUrl}
      typeName={globalName}
    />
  );
}
