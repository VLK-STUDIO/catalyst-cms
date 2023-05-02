export type FormField = TextFormField | RichTextFormField | SelectFormField;

export type SelectFormField = FormFieldBase & {
  type: "select";
  value: string;
  options: Array<{
    label: string;
    value: any;
  }>;
};

export type RichTextFormField = FormFieldBase & {
  type: "richtext";
  value: string;
};

type TextFormField = FormFieldBase & {
  type: "text";
  value: string;
};

type FormFieldBase = {
  name: string;
  label: string;
};
