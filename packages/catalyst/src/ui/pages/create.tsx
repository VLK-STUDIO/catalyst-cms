import { Session } from "next-auth";
import type { CatalystConfig, CatalystCollection } from "../../types";
import { Form } from "../components/form/Form";
import { getFormFieldsFromDataType } from "../components/form/utils";
import { canUserCreateCollectionEntry } from "../../access";
import { redirect } from "next/navigation";

type Props = {
  collection: CatalystCollection;
  name: string;
  i18n: CatalystConfig["i18n"];
  session: Session;
};

export async function CreatePage({ collection, i18n, name, session }: Props) {
  if (!canUserCreateCollectionEntry(session, collection)) {
    redirect("/catalyst/forbidden");
  }

  const fields = await getFormFieldsFromDataType(collection);

  return (
    <div className="flex flex-col bg-gray-100 h-full">
      <Form
        typeName={name}
        fields={fields}
        method="POST"
        endpoint={`/api/collection/${name}`}
        submitText="Create"
        title={`CREATE ${collection.label.toUpperCase()}`}
        i18n={i18n}
      />
    </div>
  );
}
