import {Author} from '../../Api/User/User.types';

export type UserInfoProps = {
  user: Author;

  /**
   * Whether the user info should have small size.
   */
  small?: boolean;

  /**
   * The timestamp to be converted and displayed.
   */
  timestamp?: number;
};
