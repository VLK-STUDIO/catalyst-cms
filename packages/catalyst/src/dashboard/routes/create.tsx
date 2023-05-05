import { notFound, redirect } from "next/navigation";
import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "../utils";
import { canUserCreateCollectionEntry } from "../../access";
import { RouteProps } from "./types";

export async function CreateRoute({ config, session, params }: RouteProps) {
  const [_, collectionName] = params;

  const collection = config.collections[collectionName] || notFound();

  if (!canUserCreateCollectionEntry(session, collection)) {
    redirect("/catalyst/forbidden");
  }

  const fields = await getFormFieldsFromDataType(collection);

  return (
    <div className="flex flex-col bg-gray-100 h-full">
      <Form
        typeName={collectionName}
        fields={fields}
        method="POST"
        endpoint={`/api/collection/${name}`}
        submitText="Create"
        title={`CREATE ${collection.label.toUpperCase()}`}
        i18n={config.i18n}
      />
    </div>
  );
}
