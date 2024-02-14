import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import uuid from 'react-native-uuid';
import type {ToastProps} from '../Components/Toast/Toast.props';

export type ToastConfig = ToastProps & {
  key: string;
};

export const ToastContext = createContext<{
  toasts: ToastConfig[];
  showToast: (toast: ToastProps) => () => void;
  hideToast: (key: string) => void;
}>({
  toasts: [],
  showToast: () => () => {
    //
  },
  hideToast: () => {
    //
  },
});
export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((toast: ToastProps) => {
    const key = uuid.v4().toString();

    setToasts((prev) => [...prev, {...toast, key}]);

    return () => {
      setToasts((prev) => prev.filter((t) => t.key !== key));
    };
  }, []);

  const hideToast = useCallback((key: string) => {
    setToasts((prev) => prev.filter((t) => t.key !== key));
  }, []);

  const toastContext = useMemo(
    () => ({toasts, showToast, hideToast}),
    [toasts, showToast, hideToast],
  );

  return <ToastContext.Provider value={toastContext}>{children}</ToastContext.Provider>;
};

export const useShowToast = () => {
  return useContext(ToastContext).showToast;
};

export const useHideToast = () => {
  return useContext(ToastContext).hideToast;
};
