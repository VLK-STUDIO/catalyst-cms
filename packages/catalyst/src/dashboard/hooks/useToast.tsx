import { ToastType } from "../_shared/Toast/types";
import { Toast, ToastProps } from "../_shared/Toast/Toast";
import { ToastPosition, toast } from "react-toastify";
import clsx from "clsx";

export type ToastContent = {
  type: ToastType;
  title: string;
  message?: string;
};

type ShowToastAttributes = ToastProps & { position?: ToastPosition };
const containerStyleMap: Record<ToastType, string> = {
  success: "!border-green-500",
  error: "!border-red-500",
  warning: "!border-yellow-500",
  info: "!border-blue-500"
};

export function useToast() {
  function showToast({
    position = "bottom-right",
    ...toastProps
  }: ShowToastAttributes) {
    const selectedStyle = containerStyleMap[toastProps.type];

    toast(<Toast {...toastProps} />, {
      position,
      className: clsx(
        "!p-2 bg-gray-50 drop-shadow-lg border-l-8",
        selectedStyle
      ),
      hideProgressBar: true,
      autoClose: 2500
    });
  }

  return {
    showToast
  };
}
