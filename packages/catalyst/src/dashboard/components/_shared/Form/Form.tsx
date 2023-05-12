"use client";

import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { useSearchParams } from "next/navigation";
import { LocaleSwitch } from "./LocaleSwitch";
import { LivePreviewFrame } from "./LivePreviewFrame";
import { FormElements } from "./FormElements";
import { useMemo, useState } from "react";
import { FormField } from "./types";
import clsx from "clsx";
import { getObjectWithDepopulatedReferences } from "./utils";
import { useToast } from "../../../hooks/useToast";

type Props = {
  fields: FormField[];
  endpoint: string;
  method: "POST" | "PATCH";
  submitText: string;
  title: string;
  previewUrl?: string;
  i18n: {
    locales: readonly string[];
    defaultLocale: string;
  };
  typeName: string;
};

export const Form: React.FC<Props> = ({
  fields,
  endpoint,
  method,
  submitText,
  title,
  previewUrl,
  i18n,
  typeName
}) => {
  const params = useSearchParams();
  const { showToast } = useToast();
  const locale = useMemo(
    () => (params ? params.get("locale") : null),
    [params]
  );
  const [pending, setPending] = useState(false);

  const form = useForm({
    defaultValues: fields.reduce(
      (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
      {}
    )
  });

  const onSubmit = form.handleSubmit(async data => {
    const depopulatedData = getObjectWithDepopulatedReferences(data);

    setPending(true);

    const res = await fetch(`${endpoint}${locale ? `?locale=${locale}` : ""}`, {
      method,
      body: JSON.stringify(depopulatedData)
    });

    if (!res.ok) {
      showToast({ title: "Something went wrong. Try again", type: "error" });
      throw new Error("Bad server response:" + res.status);
    }

    showToast({ title: "Operation completed", type: "success" });

    setPending(false);
  });

  const liveData = form.watch();

  return (
    <div className="relative flex h-full">
      <div
        className={clsx(
          "relative flex w-full flex-col bg-gray-100 p-16",
          previewUrl && "max-w-lg"
        )}
      >
        <h1 className="mb-8 text-4xl font-black uppercase text-red-600">
          {title}
        </h1>
        <form onSubmit={onSubmit} className=" flex flex-col gap-4">
          <FormElements form={form} fields={fields} />
          <Button className="mt-4" type="submit" loading={pending}>
            {submitText}
          </Button>
        </form>
        <LocaleSwitch {...i18n} />
      </div>
      {previewUrl && (
        <LivePreviewFrame
          data={liveData}
          url={previewUrl}
          typeName={typeName}
        />
      )}
    </div>
  );
};
