"use client";

import { forwardRef } from "react";

type Props = {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: {
    label: string;
    value: any;
  }[];
  name: string;
  value: any;
};

export const SelectInput = forwardRef<HTMLSelectElement, Props>(
  function SelectInput({ label, onChange, onBlur, options, name, value }, ref) {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor="" className="font-semibold text-gray-600">
          {label}
        </label>
        <select
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          value={value}
          className="p-2 rounded border border-gray-300"
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
