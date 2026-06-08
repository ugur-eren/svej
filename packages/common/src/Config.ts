export default {
  // Max File Size in bytes (200MB)
  maxFileSize: 1024 * 1024 * 200,
  maxMediasPerPost: 9,
  maxPostImageDimension: 1080,
  maxPostVideoDimension: 1080,
  maxPostVideoDuration: 2 * 60, // 2 minutes

  maxProfilePhotoDimension: 512,
  maxCoverPhotoDimension: 1080,
  profilePhotoAspectRatio: [1, 1],
  coverPhotoAspectRatio: [16, 10],

  usernameMinLength: 4,
  usernameMaxLength: 20,
  passwordMinLength: 6,
  passwordMaxLength: 512,

  bioMaxLength: 256,
  bioMaxLines: 5,

  postDescriptionMaxLength: 1024,
  postDescriptionMaxLines: 10,
  postsPerPage: 10,

  commentMaxLength: 512,
  commentMaxLines: 5,

  chatMessageMaxLength: 512,
  chatMessageMaxLines: 5,
  chatMessageRateLimitMax: 10,
  chatMessageRateLimitWindowMs: 10_000,

  relationsPerPage: 20,

  notificationsPerPage: 20,

  // JWT Configurations
  jwtIssuer: 'svej',
  jwtDefaultTTL: 24 * 60 * 60, // 24 hours
  jwtAccessTokenTTL: 15 * 60, // 15 minutes
  jwtRefreshTokenTTL: 30 * 24 * 60 * 60, // 30 days

  sessionAbsoluteTTL: 180 * 24 * 60 * 60, // 180 days
  sessionGracePeriod: 5, // 5 seconds

  refreshTokenCookieName: 'svej_refresh_token',

  defaultFileCacheTTL: 30 * 24 * 60 * 60, // 30 days
} as const;
