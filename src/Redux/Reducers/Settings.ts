import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import * as Languages from '../../Languages';

export type SettingsState = {
  theme: 'default' | 'light' | 'dark';
  language: 'default' | keyof typeof Languages;
};

const initialState: SettingsState = {
  theme: 'default',
  language: 'default',
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
  },
});

export const SettingsActions = SettingsSlice.actions;
export const SettingsReducer = SettingsSlice.reducer;
