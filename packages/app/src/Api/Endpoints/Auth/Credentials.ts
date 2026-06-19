import AuthApiInstance from '../../AuthApiInstance';

export const login = async (data: Parameters<typeof AuthApiInstance.credentials.login.post>[0]) => {
  return AuthApiInstance.credentials.login.post(data);
};

export const register = async (
  data: Parameters<typeof AuthApiInstance.credentials.register.post>[0],
) => {
  return AuthApiInstance.credentials.register.post(data);
};

export const changePassword = async (
  data: Parameters<(typeof AuthApiInstance.credentials)['change-password']['post']>[0],
) => {
  return AuthApiInstance.credentials['change-password'].post(data);
};
