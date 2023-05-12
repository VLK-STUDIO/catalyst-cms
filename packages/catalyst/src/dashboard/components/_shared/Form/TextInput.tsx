"use client";

import clsx from "clsx";
import { forwardRef } from "react";

type Props = {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
};

export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  props,
  ref
) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-gray-600" htmlFor={props.name}>
        {props.label}
      </label>
      <input
        className={clsx(
          "rounded border border-gray-300 p-2",
          props.error && "border-red-600"
        )}
        type="text"
        name={props.name}
        placeholder={props.placeholder}
        ref={ref}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
      />
      {props.error && (
        <span className="mt-1 text-xs text-red-600">{props.error}</span>
      )}
    </div>
  );
});
