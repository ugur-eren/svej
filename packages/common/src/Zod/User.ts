import {z} from 'zod';
import Config from '../Config';

export const Create = z.object({
  username: z.string().trim().min(Config.usernameMinLength).max(Config.usernameMaxLength),
  fullname: z.string().trim().optional(),
  email: z.string().trim().email(),
  password: z.string().min(Config.passwordMinLength).max(Config.passwordMaxLength),
});
