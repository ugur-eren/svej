export default {
  // Max File Size in bytes (30MB)
  maxFileSize: 1024 * 1024 * 200,
  maxMediasPerPost: 9,
  maxPostImageDimension: 1080,
  maxPostVideoDimension: 1080,

  maxProfilePhotoDimension: 512,
  maxCoverPhotoDimension: 1080,
  profilePhotoAspectRatio: [1, 1],
  coverPhotoAspectRatio: [16, 10],

  usernameMinLength: 4,
  usernameMaxLength: 20,
  passwordMinLength: 6,
  passwordMaxLength: 512,

  postDescriptionMaxLength: 1024,
  postDescriptionMaxLines: 10,
  postsPerPage: 10,

  commentMaxLength: 512,
  commentMaxLines: 5,

  relationsPerPage: 20,
} as const;
