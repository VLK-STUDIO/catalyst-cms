"use client";

import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "../Button";
import { LocaleSwitch } from "./LocaleSwitch";
import { LivePreviewFrame } from "./LivePreviewFrame";
import { FormElements } from "./FormElements";
import { FormField } from "./types";
import { getObjectWithDepopulatedReferences } from "./utils";
import { useToast } from "../../../hooks/useToast";

type Props = {
  action: (edits: Record<string, unknown>) => Promise<
    | { success: true }
    | {
        success: false;
        error: {
          message: string;
          field?: string;
        };
      }
  >;
  fields: FormField[];
  submitText: string;
  title: string;
  previewUrl?: string;
  typeName: string;
  i18n: {
    locales: readonly string[];
    defaultLocale: string;
  };
};

export const Form: React.FC<Props> = ({
  fields,
  submitText,
  title,
  previewUrl,
  i18n,
  typeName,
  action
}) => {
  const { showToast } = useToast();

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

    let res;
    try {
      res = await action(depopulatedData);
    } catch {
      res = {
        success: false,
        error: {
          message: "Network error. Try again."
        }
      };
    } finally {
      setPending(false);
    }

    if ("error" in res) {
      if ("field" in res.error) {
        form.setError(`root.${res.error.field}`, {
          message: res.error.message
        });

        return showToast({
          title: "Validation error",
          description: res.error.message,
          type: "error"
        });
      }

      return showToast({
        title: "Something went wrong. Try again.",
        type: "error"
      });
    }

    showToast({ title: "Operation complete!", type: "success" });
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
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
