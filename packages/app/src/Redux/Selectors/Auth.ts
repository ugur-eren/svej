import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const Auth = (state: RootState) => state.auth;

export const Authenticated = createSelector(Auth, (auth) => auth.authenticated);

export const AccessToken = createSelector(Auth, (auth) => auth.accessToken);

export const UserNullable = createSelector(Auth, (auth) => auth.user);

export const User = UserNullable as (
  state: RootState,
) => NonNullable<ReturnType<typeof UserNullable>>;

export const UserIsSelf = createSelector(
  [User, (_state, username: string) => username],
  (user, username) => user.username === username,
);
