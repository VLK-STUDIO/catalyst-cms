"use client";

import { forwardRef } from "react";
import clsx from "clsx";
import { Spinner } from "./Spinner";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button";
  loading?: boolean;
  disabled?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, onClick, className, type = "button", disabled, loading },
  ref
) {
  return (
    <button
      className={clsx(
        "flex items-center justify-center gap-2 rounded !bg-red-600 p-2 font-semibold text-white hover:bg-red-700 disabled:!bg-gray-400",
        className
      )}
      onClick={onClick}
      type={type}
      ref={ref}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          Processing...
          <Spinner />
        </>
      ) : (
        children
      )}
    </button>
  );
});
