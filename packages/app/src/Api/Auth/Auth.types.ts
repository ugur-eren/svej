import type {User} from '../User/User.types';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type LogoutResponse = {
  ok: boolean;
};

export type VerifyRequest = {
  token: string;
};

export type VerifyResponse = {
  ok: boolean;
};
