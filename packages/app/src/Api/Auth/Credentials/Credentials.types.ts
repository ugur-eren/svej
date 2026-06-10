import {SessionUser, Zod} from '@svej/common';

export type LoginRequest = {
  username: string;
  password: string;
};
export type LoginResponse = {
  accessToken: string;
  user: SessionUser;
};

export type RegisterRequest = (typeof Zod.Auth.Register)['_output'];
export type RegisterResponse = {
  accessToken: string;
  user: SessionUser;
};

export type ChangePasswordRequest = (typeof Zod.Auth.ChangePassword)['_output'];
export type ChangePasswordResponse = {
  accessToken: string;
  user: SessionUser;
};
