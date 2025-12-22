"use client";

import { ToastContainer, ToastContainerProps, toast, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast configuration props
export interface ToastProps extends Partial<ToastContainerProps> {
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: "light" | "dark" | "colored";
}

// Toast function interface
export interface ToastFunctions {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  default: (message: string, options?: ToastOptions) => void;
  dismiss: (toastId?: string) => void;
}

export interface ToastOptions {
  position?: ToastProps["position"];
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: ToastProps["theme"];
  toastId?: string;
}

// Default configuration
const defaultConfig: ToastProps = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "light",
};

// Toast component
export function Toast({ ...props }: ToastProps) {
  const config = { ...defaultConfig, ...props };

  return (
    <ToastContainer
      position={config.position}
      autoClose={config.autoClose}
      hideProgressBar={config.hideProgressBar}
      newestOnTop={config.newestOnTop}
      closeOnClick={config.closeOnClick}
      rtl={config.rtl}
      pauseOnFocusLoss={config.pauseOnFocusLoss}
      draggable={config.draggable}
      pauseOnHover={config.pauseOnHover}
      theme={config.theme}
      style={{
        zIndex: 9999,
      }}
    />
  );
}

// Toast utility functions
export const showToast: ToastFunctions = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      position: options?.position || defaultConfig.position,
      autoClose: options?.autoClose || defaultConfig.autoClose,
      hideProgressBar: options?.hideProgressBar || defaultConfig.hideProgressBar,
      closeOnClick: options?.closeOnClick || defaultConfig.closeOnClick,
      pauseOnHover: options?.pauseOnHover || defaultConfig.pauseOnHover,
      draggable: options?.draggable || defaultConfig.draggable,
      theme: options?.theme || defaultConfig.theme,
      toastId: options?.toastId,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      position: options?.position || defaultConfig.position,
      autoClose: options?.autoClose || defaultConfig.autoClose,
      hideProgressBar: options?.hideProgressBar || defaultConfig.hideProgressBar,
      closeOnClick: options?.closeOnClick || defaultConfig.closeOnClick,
      pauseOnHover: options?.pauseOnHover || defaultConfig.pauseOnHover,
      draggable: options?.draggable || defaultConfig.draggable,
      theme: options?.theme || defaultConfig.theme,
      toastId: options?.toastId,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warn(message, {
      position: options?.position || defaultConfig.position,
      autoClose: options?.autoClose || defaultConfig.autoClose,
      hideProgressBar: options?.hideProgressBar || defaultConfig.hideProgressBar,
      closeOnClick: options?.closeOnClick || defaultConfig.closeOnClick,
      pauseOnHover: options?.pauseOnHover || defaultConfig.pauseOnHover,
      draggable: options?.draggable || defaultConfig.draggable,
      theme: options?.theme || defaultConfig.theme,
      toastId: options?.toastId,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      position: options?.position || defaultConfig.position,
      autoClose: options?.autoClose || defaultConfig.autoClose,
      hideProgressBar: options?.hideProgressBar || defaultConfig.hideProgressBar,
      closeOnClick: options?.closeOnClick || defaultConfig.closeOnClick,
      pauseOnHover: options?.pauseOnHover || defaultConfig.pauseOnHover,
      draggable: options?.draggable || defaultConfig.draggable,
      theme: options?.theme || defaultConfig.theme,
      toastId: options?.toastId,
    });
  },

  default: (message: string, options?: ToastOptions) => {
    toast(message, {
      position: options?.position || defaultConfig.position,
      autoClose: options?.autoClose || defaultConfig.autoClose,
      hideProgressBar: options?.hideProgressBar || defaultConfig.hideProgressBar,
      closeOnClick: options?.closeOnClick || defaultConfig.closeOnClick,
      pauseOnHover: options?.pauseOnHover || defaultConfig.pauseOnHover,
      draggable: options?.draggable || defaultConfig.draggable,
      theme: options?.theme || defaultConfig.theme,
      toastId: options?.toastId,
    });
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};

// Custom toast component with icon (optional)
export function CustomToast({ type, message }: { type: TypeOptions; message: string }) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "💡";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{getIcon()}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}

// Hook for using toast
export function useToast() {
  return showToast;
}

export default Toast;