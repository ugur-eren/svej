import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../Api/User/User.types';

export type AuthState = {
  // token should be read from AsyncStorage
  // token: string;

  authenticated: boolean;
  user?: User;
};

const initialState: AuthState = {
  authenticated: false,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authenticated = action.payload;
    },

    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
  },
});

export const AuthActions = AuthSlice.actions;
export const AuthReducer = AuthSlice.reducer;
