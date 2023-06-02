// eslint-disable-next-line prefer-destructuring
const env = process.env;

export const PORT = env.PORT || 3001;
export const BCRYPT_ROUNDS = env.BCRYPT_ROUNDS || 10;
