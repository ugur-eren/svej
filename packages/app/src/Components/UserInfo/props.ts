import {UsersApi} from '@/Api';

export type UserInfoProps = {
  user: UsersApi.Author;

  /**
   * Whether the user info should have small size.
   */
  small?: boolean;

  /**
   * The timestamp to be converted and displayed.
   */
  timestamp?: number;

  /**
   * Callback function to be called when the actions button is pressed.
   * This is optional and can be used to handle actions like opening a modal or navigating to another screen.
   * If not provided, the actions button will not be displayed.
   */
  onActionsPress?: () => void;
};
