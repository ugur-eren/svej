import ApiInstance from '../ApiInstance';

export type Author = (Awaited<ReturnType<typeof ApiInstance.users.get>> & {
  error: null;
})['data'][number];

export type User = (Awaited<ReturnType<ReturnType<typeof ApiInstance.users>['get']>> & {
  error: null;
})['data'];

export const search = async (query: string) => {
  return ApiInstance.users.get({query: {q: query}});
};

export const getById = async (userId: string) => {
  return ApiInstance.users({userId}).get();
};

export const getByUsername = async (username: string) => {
  return ApiInstance.users['by-username']({username}).get();
};

export const getPosts = async (userId: string) => {
  return ApiInstance.users({userId}).posts.get();
};

export const getMe = async () => {
  return ApiInstance.users.me.get();
};

export const updateMe = async (data: Parameters<typeof ApiInstance.users.me.patch>[0]) => {
  return ApiInstance.users.me.patch(data);
};

export const changeProfilePhoto = async (media: File) => {
  return ApiInstance.users.me['profile-photo'].put(
    {media},
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const changeCoverPhoto = async (media: File) => {
  return ApiInstance.users.me['cover-photo'].put(
    {media},
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const getFollowers = async (userId: string) => {
  return ApiInstance.users({userId}).followers.get();
};

export const getFollowing = async (userId: string) => {
  return ApiInstance.users({userId}).following.get();
};

export const follow = async (userId: string) => {
  return ApiInstance.users.me.following({userId}).post();
};

export const unfollow = async (userId: string) => {
  return ApiInstance.users.me.following({userId}).delete();
};
