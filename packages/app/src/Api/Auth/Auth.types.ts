import {SessionUser} from '@svej/common';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: SessionUser;
};

export type LogoutResponse = {
  ok: boolean;
};

export type RefreshResponse = {
  accessToken: string;
  user: SessionUser;
};
