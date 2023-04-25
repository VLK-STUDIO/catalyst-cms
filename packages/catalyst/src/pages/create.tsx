import type { CatalystCollection, CatalystConfig } from "../types";
import { Form } from "../components/form/Form";
import { getFormFieldsFromCollection } from "../components/form/utils";

type Props = {
  collection: CatalystCollection & {
    name: string;
  };
  i18n: CatalystConfig["i18n"];
};

export async function CreatePage({ collection, i18n }: Props) {
  const fields = await getFormFieldsFromCollection(collection);

  return (
    <div className="flex flex-col bg-gray-100 h-full">
      <Form
        collectionName={collection.name}
        fields={fields}
        method="POST"
        endpoint={`/api/${collection.name}`}
        submitText="Create"
        title={`CREATE ${collection.label.toUpperCase()}`}
        i18n={i18n}
      />
    </div>
  );
}
