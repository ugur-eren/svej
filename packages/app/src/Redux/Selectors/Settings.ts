import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../store';

export const Settings = (state: RootState) => state.settings;

export const Theme = createSelector(Settings, (settings) => settings.theme);
export const Language = createSelector(Settings, (settings) => settings.language);
export const Muted = createSelector(Settings, (settings) => settings.muted);
