"use client";

/**
 * ToastCard — customise this file however you want.
 * You get: type, title, message, onDismiss.
 */
import { ToastItem } from "./toast-context";

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const TOAST_COMPONENTS: Record<
  ToastItem["type"],
  React.ComponentType<{ toast: ToastItem; onDismiss: () => void }>
> = {
  success: SuccessToast,
  error: ErrorToast,
  info: InfoToast,
  warning: WarningToast,
};

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const Component = TOAST_COMPONENTS[toast.type];
  return <Component toast={toast} onDismiss={() => onDismiss(toast.id)} />;
}

export function SuccessToast({ toast, onDismiss }) {
  const handleDismiss = () => {
    toast?.onManualClose?.();
    onDismiss();
  };
  return (
    <div
      onClick={toast.onClick}
      className="bg-[#ffffff] !opacity-[0.90] dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-md shadow-lg
        px-4
        py-2
        cursor-pointer
        transform transition-all duration-300
        w-[300px] h-[70px]
        hover:shadow-xl
        animate-in slide-in-from-right-8
       top-5 right-2 fixed
       z-[10000]
        overflow-hidden
        flex items-center justify-between 
        "
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-[80%] absolute left-2 top-1/2 -translate-y-1/2 bg-blue-500 rounded-sm"></div>

        <div className="w-5 h-5 ml-1 rounded-full flex justify-center items-center bg-blue-500 text-white">
          i
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            New Message
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-300  line-clamp-1 -mt-1 max-w-[200px] ">
            {toast.message}
          </p>
        </div>
      </div>

      <button onClick={handleDismiss}>✕</button>
    </div>
  );
}
export function ErrorToast({ toast, onDismiss }) {
  const handleDismiss = () => {
    toast?.onManualClose?.();
    onDismiss();
  };
  return (
    <div className="fixed w-full h-screen top-0 left-0 right-0 bg-[#ffffff07] backdrop-blur-sm  flex z-[5000000] justify-center items-center">
      <div className="w-[280px] rounded-md shadow-sm bg-[#ffffff]">
        <div className="text-center py-2 w-full">
          <span className="text-base font-medium text-black ">Error</span>
        </div>
        <div className="flex justify-center py-4">
          <p className="text-sm text-black text-center">{toast.message}</p>
        </div>

        <div className="text-center py-2 border-t border-t-[#dddddd6b]">
          <button
            className="w-full text-blue-600 text-sm"
            onClick={handleDismiss}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export function WarningToast({ toast, onDismiss }) {
  return (
    <div className="...your error styles... maybe a modal-like card">
      {/* <MyAlertIcon /> */}
      <h3>{toast.title}</h3>
      <p>{toast.message}</p>
      <button onClick={onDismiss}>Got it</button>
    </div>
  );
}
export function InfoToast({ toast, onDismiss }) {
  return (
    <div className="...your error styles... maybe a modal-like card">
      {/* <MyAlertIcon /> */}
      <h3>{toast.title}</h3>
      <p>{toast.message}</p>
      <button onClick={onDismiss}>Got it</button>
    </div>
  );
}
