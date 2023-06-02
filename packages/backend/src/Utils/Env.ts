// eslint-disable-next-line prefer-destructuring
const env = (key: string) => process.env[`SVEJ_BACKEND_${key}`];

export const USE_CONFIG = env('USE_CONFIG') || 'false';
export const PORT = Number(env('PORT')) || 3001;
export const BCRYPT_ROUNDS = Number(env('BCRYPT_ROUNDS')) || 10;
