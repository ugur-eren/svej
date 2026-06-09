export type TransparentHeaderProps = {
  /**
   * Text for the title.
   */
  title: string;

  /**
   * Whether to hide the back button
   */
  hideBack?: boolean;

  onSettingsPress?: () => void | Promise<void>;
  onMorePress?: () => void | Promise<void>;
};
