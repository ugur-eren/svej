export default {
  about_language: {
    name: 'English',
    code: 'en',
  },

  appName: 'SveJ',

  common: {
    login: 'Login',
    register: 'Register',
  },

  routes: {
    login: {
      dontHaveAnAccount: "You don't have an account yet?",
      username: 'Username',
      password: 'Password',
    },
    register: {
      alreadyHaveAccount: 'Do you already have an account?',
      username: 'Username',
      password: 'Password',
      passwordValidation: 'Password again',
      fullname: 'Name and Surname',
      email: 'Email',
    },
  },

  errors: {
    USERNAME_SHORT: 'Username must be at least 4 characters',
    USERNAME_INVALID: 'Username is invalid',
    USERNAME_REQUIRED: 'Username is required',
    PASSWORD_SHORT: 'Password must be at least 6 characters',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORDS_NOT_MATCH: 'Passwords do not match',
    EMAIL_INVALID: 'Email is invalid',
  },
};
