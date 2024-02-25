import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import * as Languages from '../../Languages';

export type SettingsState = {
  theme: 'default' | 'light' | 'dark';
  language: 'default' | keyof typeof Languages;
  muted: boolean;
};

const initialState: SettingsState = {
  theme: 'default',
  language: 'default',
  muted: false,
};

export const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },

    setLanguage: (state, action: PayloadAction<SettingsState['language']>) => {
      state.language = action.payload;
    },

    setMuted: (state, action: PayloadAction<SettingsState['muted']>) => {
      state.muted = action.payload;
    },
    toggleMuted: (state) => {
      state.muted = !state.muted;
    },
  },
});

export const SettingsActions = SettingsSlice.actions;
export const SettingsReducer = SettingsSlice.reducer;
