import {AppbarHeaderProps} from 'react-native-paper';

export type HeaderProps = Omit<AppbarHeaderProps, 'children'> & {
  /**
   * Text for the title.
   */
  title: string;

  /**
   * Text for the subtitle.
   */
  subtitle?: string;

  left?: React.ReactNode;

  /**
   * Whether to hide the back button
   */
  hideBack?: boolean;
};
