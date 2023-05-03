"use client";

import { useForm } from "react-hook-form";
import { Button } from "../Button";
import { useSearchParams } from "next/navigation";
import { LocaleSwitch } from "../LocaleSwitch";
import { LivePreviewFrame } from "../LivePreviewFrame";
import { FormElements } from "./FormElements";
import { useMemo } from "react";
import { FormField } from "./types";
import clsx from "clsx";
import { getObjectWithDepopulatedReferences } from "./utils";

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
  typeName,
}) => {
  const params = useSearchParams();

  const locale = useMemo(
    () => (params ? params.get("locale") : null),
    [params]
  );

  const form = useForm({
    defaultValues: fields.reduce(
      (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
      {}
    ),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const depopulatedData = getObjectWithDepopulatedReferences(data);

    const res = await fetch(`${endpoint}${locale ? `?locale=${locale}` : ""}`, {
      method,
      body: JSON.stringify(depopulatedData),
    });

    if (!res.ok) {
      throw new Error("Bad server response:" + res.status);
    }
  });

  const liveData = form.watch();

  return (
    <div className="flex h-full relative">
      <div
        className={clsx(
          "flex flex-col relative p-16 bg-gray-100 w-full",
          previewUrl && "max-w-lg"
        )}
      >
        <h1 className="text-red-600 font-black text-4xl mb-8 uppercase">
          {title}
        </h1>
        <form onSubmit={onSubmit} className="relative flex flex-col gap-4">
          <FormElements form={form} fields={fields} />
          <Button className="mt-4" type="submit">
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
