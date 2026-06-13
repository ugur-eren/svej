import {SessionUser, Zod, ZodInfer} from '@svej/common';

export type LoginRequest = {
  username: string;
  password: string;
};
export type LoginResponse = {
  accessToken: string;
  user: SessionUser;
};

export type RegisterRequest = ZodInfer<typeof Zod.Auth.Register>;
export type RegisterResponse = {
  accessToken: string;
  user: SessionUser;
};

export type ChangePasswordRequest = ZodInfer<typeof Zod.Auth.ChangePassword>;
export type ChangePasswordResponse = {
  accessToken: string;
  user: SessionUser;
};
