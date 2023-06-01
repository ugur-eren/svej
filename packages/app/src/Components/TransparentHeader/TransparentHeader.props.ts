export type TransparentHeaderProps = {
  /**
   * Text for the title.
   */
  title: string;

  /**
   * Text for the subtitle.
   */
  subtitle?: string;

  /**
   * Whether to hide the back button
   */
  hideBack?: boolean;

  onSettingsPress?: () => void | Promise<void>;
  onMorePress?: () => void | Promise<void>;
};
