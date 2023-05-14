import {AppbarHeaderProps} from 'react-native-paper';

export type HeaderProps = Omit<AppbarHeaderProps, 'children'> & {
  title: string;
  subtitle?: string;
  avatar?: React.ReactNode;

  /**
   * Whether to hide the back button
   */
  hideBack?: boolean;
};
