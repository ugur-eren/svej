import {z} from 'zod';
import Config from '../Config';

export const username = z
  .string()
  .trim()
  .min(Config.usernameMinLength)
  .max(Config.usernameMaxLength);

export const fullname = z.string().trim().optional();

export const email = z.string().trim().email();

export const password = z.string().min(Config.passwordMinLength).max(Config.passwordMaxLength);

export const bio = z
  .string()
  .trim()
  .max(Config.bioMaxLength)
  .refine((desc) => desc.split(/\r\n|\r|\n/).length <= Config.bioMaxLines, {
    message: `Bio must have less than ${Config.bioMaxLines} lines`,
  })
  .optional();

export const Create = z.object({
  username,
  fullname,
  email,
  password,
});

export const Edit = z.object({
  username,
  fullname,
  email,
  bio,
});

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
  newPasswordConfirm: password,
});
