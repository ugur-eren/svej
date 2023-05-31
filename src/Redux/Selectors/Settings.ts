import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const selectSettings = (state: RootState) => state.settings;

export const selectTheme = createSelector(selectSettings, (settings) => settings.theme);
export const selectLanguage = createSelector(selectSettings, (settings) => settings.language);
