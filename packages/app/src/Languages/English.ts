import {ErrorCodesKeys} from 'common';
import {PROBLEM_CODE} from 'apisauce';

export default {
  about_language: {
    name: 'English',
    code: 'en',
  },

  appName: 'SveJ',

  common: {
    login: 'Login',
    register: 'Register',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    follow: 'Follow',
    unfollow: 'Unfollow',
    comments: 'Comments',
    send_message: 'Send message',
    posts: 'Posts',
    follows: 'Follows',
    followers: 'Followers',
    theme: 'Theme',
    language: 'Language',
    logout: 'Logout',
    warning: 'Warning',
  },

  auth: {
    dontHaveAnAccount: "You don't have an account yet?",
    alreadyHaveAccount: 'Do you already have an account?',
    forgotPassword: 'Have you forgot your password?',
    username: 'Username',
    password: 'Password',
    passwordValidation: 'Password again',
    currentPassword: 'Current password',
    newPassword: 'New password',
    fullname: 'Name and Surname',
    email: 'Email',
    bio: 'Bio',
  },

  time: {
    just_now: 'Just now',
    just_now_short: 'now',

    seconds_ago: '%time% seconds ago',
    minutes_ago: '%time% minutes ago',
    hours_ago: '%time% hours ago',
    days_ago: '%time% days ago',
    weeks_ago: '%time% weeks ago',
    months_ago: '%time% months ago',
    years_ago: '%time% years ago',

    seconds_no_ago: '%time% seconds',
    minutes_no_ago: '%time% minutes',
    hours_no_ago: '%time% hours',
    days_no_ago: '%time% days',
    weeks_no_ago: '%time% weeks',
    months_no_ago: '%time% months',
    years_no_ago: '%time% years',

    seconds_short: '%time% s',
    minutes_short: '%time% m',
    hours_short: '%time% h',
    days_short: '%time% d',
    weeks_short: '%time% w',
    months_short: '%time% mo',
    years_short: '%time% yr',
  },

  chat: {
    title: 'Messages',
    message_placeholder: 'Your message...',
  },

  comments: {
    title: 'Comments',
    comment_placeholder: 'Your comment...',
  },

  notifications: {
    title: 'Notifications',
    types: {
      comment: 'made a comment on your post',
      follow: 'started following you',
      unfollow: 'unfollowed you',
      like: 'liked your post',
      comment_tag: 'tagged you in a comment',
      post_tag: 'tagged you in a post',
      warning: 'You got a warning!',
    },
  },

  profile: {
    title: 'Profile',
    profile_photo_changed_title: 'Success',
    profile_photo_changed_message: 'Your profile photo changed successfuly',
    cover_photo_changed_title: 'Success',
    cover_photo_changed_message: 'Your cover photo changed successfuly',
  },

  search: {
    search_placeholder: 'Search...',
  },

  share: {
    title: 'Share',
    page_title: 'Share a post',
    detail: 'Detail',
    message_placeholder: 'Message',
    media: 'Media',
    share_button: 'Share',
    picture: 'Picture',
    video: 'Video',

    share_in_progress_title: 'Share in progress',
    share_in_progress_message:
      'There is already an active share process. Please wait until it is finished.',

    share_success_title: 'Post shared',
    share_success_message: 'Your post has been shared successfully.',

    dialog_title: 'Share',
    dialog_message: 'Are you sure you want to share this post?',
    dialog_share_button: 'Share',

    message_too_long_title: 'Message too long',
    message_too_long_message: 'Your message is too long. It must be at most %max% characters.',
  },

  settings: {
    title: 'Settings',
    edit_profile: 'Edit Profile',
    change_password: 'Change Password',
    blocked_users: 'Blocked Users',
    notifications: 'Notifications',
    light_theme: 'Light Theme',
    dark_theme: 'Dark Theme',
    system_default: 'System Default',
  },

  explore: {
    title: 'Explore',
  },

  post: {
    no_comments: 'There are no comments. Be the first one!',
  },

  errors: {
    ERROR: 'Error',
    USERNAME_SHORT: 'Username must be at least %min% characters',
    USERNAME_INVALID: 'Username is invalid',
    USERNAME_REQUIRED: 'Username is required',
    PASSWORD_SHORT: 'Password must be at least %min% characters',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORDS_NOT_MATCH: 'Passwords do not match',
    EMAIL_INVALID: 'Email is invalid',
    COMMENT_INVALID: 'Your comment is invalid and cannot be posted',
  },

  api_errors: {
    UnknownError: 'An unknown error has occurred. Please try again later.',
    FillAllFields: 'Please fill all fields.',
    Unauthorized: 'You are not authorized to do this action.',
    NoAuthToken: 'You are not authorized to do this action.',
    InvalidAuthToken: 'You are not authorized to do this action.',
    NoTokenInput: 'You are not authorized to do this action.',
    WrongPassword: 'Wrong password.',

    UsernameAlreadyExists: 'Username is already in use.',
    EmailAlreadyExists: 'Email is already in use.',
    UserNotFound: 'User not found.',
    CannotFollowYourself: 'You cannot follow yourself.',
    AlreadyFollowing: 'You are already following this user.',
    NotFollowing: 'You are not following this user.',

    PostNotFound: 'Post not found.',
    PostDoesntHaveMediaOrDescription: 'Post must have a media or description.',

    FileProcessingError: 'There has been an error while processing the file.',

    CommentNotFound: 'Comment not found.',
  } satisfies Partial<Record<ErrorCodesKeys, string>>,

  api_problems: {
    SERVER_ERROR: {
      title: 'Server Error',
      message: 'There has been a error while making your request. Please try again later.',
    },
    NETWORK_ERROR: {
      title: 'Network Error',
      message:
        'There has been a network error while connecting to servers. Please check your connection and try again.',
    },
    TIMEOUT_ERROR: {
      title: 'Timeout',
      message: 'Your request took too long. Please check your connection and try again.',
    },
    CONNECTION_ERROR: {
      title: 'Connection Error',
      message:
        'There has been a connection error while connecting to servers. Please check your connection and try again.',
    },
    UNKNOWN_ERROR: {
      title: 'Unknown Error',
      message:
        'There has been an unknown error. We will investigate this problem. Please try again later.',
    },
  } satisfies Partial<
    Record<
      PROBLEM_CODE,
      {
        title: string;
        message: string;
      }
    >
  >,
};
