import {z} from 'zod';
import Config from '../Config';
import * as UserSchema from './User';

export const password = z.string().min(Config.passwordMinLength).max(Config.passwordMaxLength);

export const Login = z.object({
  username: UserSchema.username,
  password,
});

export const Register = z.object({
  username: UserSchema.username,
  fullname: UserSchema.fullname,
  email: UserSchema.email,
  password,
});

export const ChangePassword = z.object({
  currentPassword: password,
  newPassword: password,
});
