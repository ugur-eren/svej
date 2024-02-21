import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const selectAuth = (state: RootState) => state.auth;

export const selectAuthenticated = createSelector(selectAuth, (auth) => auth.authenticated);

export const selectUserNullable = createSelector(selectAuth, (auth) => auth.user);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const selectUser = createSelector(selectUserNullable, (user) => user!);
