"use client";

import { forwardRef } from "react";

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  props,
  ref
) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-600 font-semibold mb-1" htmlFor={props.name}>
        {props.label}
      </label>
      <input
        className="border border-gray-300 rounded p-2"
        type="text"
        name={props.name}
        placeholder={props.placeholder}
        ref={ref}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.error && (
        <span className="text-red-600 font-bold text-sm">{props.error}</span>
      )}
    </div>
  );
});
