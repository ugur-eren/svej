import {UsersApi} from '@/Api';

export type ProfileWidgetProps = {
  user: UsersApi.Author;
  right?: React.ReactNode;
};
