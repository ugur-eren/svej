import {SessionUser} from '@svej/common';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export type AuthState = {
  authenticated: boolean;
  accessToken?: string;
  user?: SessionUser;
};

const initialState: AuthState = {
  authenticated: false,
  accessToken: undefined,
  user: undefined,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{accessToken: string; user: SessionUser}>) => {
      state.authenticated = true;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.authenticated = false;
      state.accessToken = undefined;
      state.user = undefined;
    },

    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload;
    },

    setUser: (state, action: PayloadAction<SessionUser | undefined>) => {
      state.user = action.payload;
    },
  },
});

export const AuthActions = AuthSlice.actions;
export const AuthReducer = AuthSlice.reducer;
