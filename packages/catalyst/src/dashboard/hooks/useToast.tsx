import { ToastPosition, toast } from "react-toastify";
import clsx from "clsx";
import { Toast, ToastProps, ToastType } from "../components/_shared/Toast";

export type ToastContent = {
  type: ToastType;
  title: string;
  message?: string;
};

type ShowToastAttributes = ToastProps & { position?: ToastPosition };

const containerStyleMap: Record<ToastType, string> = {
  success: "!border-l-green-500",
  error: "!border-l-red-500",
  warning: "!border-l-yellow-500",
  info: "!border-l-blue-500"
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
        "!p-2 bg-gray-100 border-l-8 border border-gray-300",
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
