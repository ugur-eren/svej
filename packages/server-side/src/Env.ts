// eslint-disable-next-line prefer-destructuring
const env = (key: string) => process.env[`SVEJ_${key}`];

export const USE_CONFIG = env('PUBLIC_USE_CONFIG') || 'false';

export const BACKEND_PORT = Number(env('BACKEND_PORT')) || 3001;

export const BCRYPT_ROUNDS = Number(env('BCRYPT_ROUNDS')) || 10;

export const JWT_EXPIRE_TIME = Number(env('JWT_EXPIRE_TIME')) || 60 * 60;
export const JWT_PRIV_KEY = env('JWT_PRIV_KEY') || 'secret';

export const AWS_S3_BUCKET = env('AWS_S3_BUCKET');
export const AWS_S3_REGION = env('AWS_S3_REGION');
export const AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID');
export const AWS_ACCESS_SECRET = env('AWS_ACCESS_SECRET');
