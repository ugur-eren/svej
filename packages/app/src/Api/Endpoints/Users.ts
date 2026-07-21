import ApiInstance from '../ApiInstance';
import {ApiFile} from '../CustomClient';

export type Author = (Awaited<ReturnType<typeof search>> & {
  ok: true;
})['data'][number];

export type User = (Awaited<ReturnType<typeof getById>> & {
  ok: true;
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

export const getPosts = async (userId: string, cursor?: string) => {
  return ApiInstance.users({userId}).posts.get({query: {cursor}});
};

export const getMe = async () => {
  return ApiInstance.users.me.get();
};

export const updateMe = async (data: Parameters<typeof ApiInstance.users.me.patch>[0]) => {
  return ApiInstance.users.me.patch(data);
};

export const changeProfilePhoto = async (media: ApiFile) => {
  return ApiInstance.users.me['profile-photo'].put({media});
};

export const changeCoverPhoto = async (media: ApiFile) => {
  return ApiInstance.users.me['cover-photo'].put({media});
};

export const getFollowers = async (userId: string, cursor?: string) => {
  return ApiInstance.users({userId}).followers.get({query: {cursor}});
};

export const getFollowing = async (userId: string, cursor?: string) => {
  return ApiInstance.users({userId}).following.get({query: {cursor}});
};

export const follow = async (userId: string) => {
  return ApiInstance.users.me.following({userId}).post();
};

export const unfollow = async (userId: string) => {
  return ApiInstance.users.me.following({userId}).delete();
};
