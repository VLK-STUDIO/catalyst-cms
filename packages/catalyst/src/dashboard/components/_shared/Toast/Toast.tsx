import {
  Icon,
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle
} from "@tabler/icons-react";
import { ToastType } from "./types";
import clsx from "clsx";

const toastTypeStyleMap: Record<ToastType, string> = {
  error: "text-red-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-500"
};

const toastIconMap: Record<ToastType, Icon> = {
  success: IconCircleCheck,
  error: IconCircleX,
  info: IconInfoCircle,
  warning: IconAlertCircle
};

export type ToastProps = {
  type: ToastType;
  title: string;
};

export const Toast: React.FC<ToastProps> = ({ title, type }) => {
  const selectedStyle = toastTypeStyleMap[type];
  const SelectedToastIcon = toastIconMap[type];
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          "flex content-center items-center gap-2 text-black",
          selectedStyle
        )}
      >
        <SelectedToastIcon />
        {title}
      </div>
    </div>
  );
};
