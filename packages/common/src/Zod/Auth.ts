import {z} from 'zod';
import Config from '../Config';

export const Login = z.object({
  username: z.string().trim().min(Config.usernameMinLength).max(Config.usernameMaxLength),
  password: z.string().min(Config.passwordMinLength).max(Config.passwordMaxLength),
});
