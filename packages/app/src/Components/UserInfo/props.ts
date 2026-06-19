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
};
