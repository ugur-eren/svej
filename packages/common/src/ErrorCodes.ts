const ErrorCodesArray = [
  'UnknownError',
  'FillAllFields',

  // Auth
  'Unauthorized',
  'NoAuthToken',
  'InvalidAuthToken',
  'NoTokenInput',
  'WrongPassword',

  // User
  'UsernameAlreadyExists',
  'EmailAlreadyExists',
  'UserNotFound',

  // Post
  'PostNotFound',
  'PostDoesntHaveMediaOrDescription',

  // File
  'FileProcessingError',

  // Comment
  'CommentNotFound',
] as const;

export type ErrorCodesKeys = (typeof ErrorCodesArray)[number];

type ErrorCodes<T extends ErrorCodesKeys = ErrorCodesKeys> = {
  [K in T]: K;
};

const ErrorCodes: ErrorCodes = Object.fromEntries(
  ErrorCodesArray.map((code) => [code, code]),
) as unknown as ErrorCodes;

export default ErrorCodes;
