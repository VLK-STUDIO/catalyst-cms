"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { TextInput } from "./TextInput";
import { RichTextInput } from "./RichTextInput";
import { FormField } from "./types";
import { SelectInput } from "./SelectInput";

type Props = {
  fields: FormField[];
  form: UseFormReturn;
};

export const FormElements: React.FC<Props> = ({ form, fields }) => {
  const { getValues, setValue, control } = form;

  return (
    <>
      {fields.map(field => {
        if (field.type === "text") {
          return (
            <Controller
              control={control}
              name={field.name}
              key={field.name}
              render={({ field: f, fieldState }) => (
                <TextInput
                  key={f.name}
                  label={field.label}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                  value={f.value}
                  name={f.name}
                  error={fieldState.error?.message}
                />
              )}
            />
          );
        } else if (field.type === "richtext") {
          return (
            <RichTextInput
              key={field.name}
              label={field.label}
              defaultValue={getValues(field.name)}
              onChange={value => setValue(field.name, value)}
            />
          );
        } else if (field.type === "select") {
          return (
            <Controller
              control={control}
              name={field.name}
              key={field.name}
              render={({ field: f }) => (
                <SelectInput
                  label={field.label}
                  options={field.options}
                  onChange={f.onChange}
                  onBlur={f.onBlur}
                  value={f.value}
                  name={field.name}
                />
              )}
            />
          );
        }
      })}
    </>
  );
};
