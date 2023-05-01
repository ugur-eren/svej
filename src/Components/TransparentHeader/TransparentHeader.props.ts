export type TransparentHeaderProps = {
  title: string;
  subtitle?: string;

  /**
   * Whether to hide the back button
   */
  hideBack?: boolean;

  onSettingsPress?: () => void | Promise<void>;
  onMorePress?: () => void | Promise<void>;
};
