import bcrypt from 'bcrypt';
import {BCRYPT_ROUNDS} from './Env';

export const hash = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const verify = async (password: string, encrypted: string): Promise<boolean> => {
  return bcrypt.compare(password, encrypted);
};
