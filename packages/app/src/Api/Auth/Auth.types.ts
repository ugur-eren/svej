import {SessionUser} from '@svej/common';

export type LogoutResponse = {
  ok: boolean;
};

export type RefreshResponse = {
  accessToken: string;
  user: SessionUser;
};
