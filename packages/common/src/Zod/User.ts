import {z} from 'zod';
import Config from '../Config';

export const username = z
  .string()
  .trim()
  .min(Config.usernameMinLength)
  .max(Config.usernameMaxLength);

export const fullname = z.string().trim().optional();

export const email = z.string().trim().email();

export const bio = z
  .string()
  .trim()
  .max(Config.bioMaxLength)
  .refine((desc) => desc.split(/\r\n|\r|\n/).length <= Config.bioMaxLines, {
    message: `Bio must have less than ${Config.bioMaxLines} lines`,
  })
  .optional();

export const Edit = z.object({
  username,
  fullname,
  email,
  bio,
});
