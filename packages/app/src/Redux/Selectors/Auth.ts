import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const Auth = (state: RootState) => state.auth;

export const Authenticated = createSelector(Auth, (auth) => auth.authenticated);

export const UserNullable = createSelector(Auth, (auth) => auth.user);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const User = createSelector(UserNullable, (user) => user!);
