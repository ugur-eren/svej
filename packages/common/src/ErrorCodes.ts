const ErrorCodesArray = [
  'UnknownError',
  'FillAllFields',

  // Auth
  'Unauthorized',
  'NoAuthToken',
  'InvalidAuthToken',
  'WrongPassword',
  'AccountCreatedButLoginFailed',

  // User
  'UsernameAlreadyExists',
  'EmailAlreadyExists',
  'UserNotFound',
  'CannotFollowYourself',
  'AlreadyFollowing',
  'NotFollowing',

  // Post
  'PostNotFound',
  'PostDoesntHaveMediaOrDescription',

  // File
  'FileProcessingError',

  // Comment
  'CommentNotFound',

  // Media
  'MediaNotFound',

  // Notification
  'NotificationNotFound',

  // Chat
  'ConversationNotFound',
  'ChatRateLimited',
] as const;

export type ErrorCodesKeys = (typeof ErrorCodesArray)[number];

type ErrorCodes<T extends ErrorCodesKeys = ErrorCodesKeys> = {
  [K in T]: K;
};

const ErrorCodes: ErrorCodes = Object.fromEntries(
  ErrorCodesArray.map((code) => [code, code]),
) as unknown as ErrorCodes;

export default ErrorCodes;
