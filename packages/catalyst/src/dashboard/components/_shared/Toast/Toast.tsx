import { ToastType } from "./types";
import clsx from "clsx";

const toastTypeStyleMap: Record<ToastType, string> = {
  error: "text-red-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-500"
};

export type ToastProps = {
  type: ToastType;
  title: string;
  description?: string;
};

export const Toast: React.FC<ToastProps> = ({ title, type, description }) => {
  const selectedStyle = toastTypeStyleMap[type];
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          "flex content-center items-center gap-4",
          selectedStyle
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{title}</span>
          {description && (
            <span className="text-sm text-gray-400">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
};
