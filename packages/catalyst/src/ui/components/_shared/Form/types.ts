export type FormField = TextFormField | RichTextFormField | SelectFormField;

type SelectFormField = FormFieldBase & {
  type: "select";
  value: string;
  options: readonly {
    label: string;
    value: any;
  }[];
};

type RichTextFormField = FormFieldBase & {
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
