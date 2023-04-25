"use client";

import { forwardRef } from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode | React.ReactNode[];
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button";
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, onClick, className, type = "button" },
  ref
) {
  return (
    <button
      className={clsx(
        "flex justify-center items-center gap-2 !bg-red-600 font-semibold text-white p-2 rounded hover:bg-red-700",
        className
      )}
      onClick={onClick}
      type={type}
      ref={ref}
    >
      {children}
    </button>
  );
});
