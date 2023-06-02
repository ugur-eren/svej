const ErrorCodesArray = [
  'UnknownError',
  'FillAllFields',

  // Auth
  'Unauthorized',
  'NoAuthToken',
  'InvalidAuthToken',
  'NoTokenInput',

  // User
  'UsernameAlreadyExists',
  'UsernameShort',
  'UsernameLong',
  'EmailAlreadyExists',
  'EmailInvalid',
  'PasswordShort',
  'PasswordLong',
] as const;

type ErrorCodesKeys = (typeof ErrorCodesArray)[number];

type ErrorCodes<T extends ErrorCodesKeys = ErrorCodesKeys> = {
  [K in T]: K;
};

const ErrorCodes: ErrorCodes = Object.fromEntries(
  ErrorCodesArray.map((code) => [code, code]),
) as unknown as ErrorCodes;

export default ErrorCodes;
