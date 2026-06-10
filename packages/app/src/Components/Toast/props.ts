export type ToastProps = {
  title?: string;
  message?: string;

  /**
   * The type of the toast.
   * @default 'info'
   */
  type?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Callback when the toast is dismissed.
   */
  onDismiss?: () => void;
};
