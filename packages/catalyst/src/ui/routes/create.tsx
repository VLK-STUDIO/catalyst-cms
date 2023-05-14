import { notFound, redirect } from "next/navigation";
import { Form } from "../components/_shared/Form/Form";
import { getFormFieldsFromDataType } from "../utils";
import { canUserCreateCollectionEntry } from "../../access";
import { RouteProps } from "./types";
import { createCollectionEntry } from "../../actions/collections";

export async function CreateRoute({ config, session, params }: RouteProps) {
  const [_, collectionName] = params;

  const collection = config.collections[collectionName] || notFound();

  if (!canUserCreateCollectionEntry(session, collection)) {
    redirect("/catalyst/forbidden");
  }

  const fields = await getFormFieldsFromDataType(collection);

  const action = async (edits: Record<string, unknown>) => {
    "use server";

    const [_, collectionName] = params;

    return await createCollectionEntry(collectionName, edits);
  };

  return (
    <Form
      action={action}
      typeName={collectionName}
      fields={fields}
      submitText="Create"
      title={`CREATE ${collection.label.toUpperCase()}`}
      i18n={config.i18n}
    />
  );
}
