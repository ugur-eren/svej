import {LanguageType} from '../Hooks/Language';
import {parseLanguageParts} from './Helpers';

export type ElapsedTime = {
  value: number;
  unit: 'just_now' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
};

/**
 * Calculates the elapsed time between a timestamp and the current time.
 * @param {number} timestamp The timestamp to calculate the elapsed time from.
 * @param {number} currentTimestamp The current timestamp. Defaults to Date.now().
 * @returns {ElapsedTime} The elapsed time.
 */
export const getElapsedFromTimestamp = (
  timestamp: number,
  currentTimestamp = Date.now(),
): ElapsedTime => {
  const elapsed = Math.floor(currentTimestamp - timestamp) / 1000;

  if (elapsed < 10) {
    return {value: 0, unit: 'just_now'};
  }

  if (elapsed < 60) {
    return {value: elapsed, unit: 'seconds'};
  }

  const minutes = Math.floor(elapsed / 60);
  if (minutes < 60) {
    return {value: minutes, unit: 'minutes'};
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return {value: hours, unit: 'hours'};
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return {value: days, unit: 'days'};
  }

  if (days < 31) {
    return {value: Math.floor(days / 7), unit: 'weeks'};
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return {value: months, unit: 'months'};
  }

  return {value: Math.floor(months / 12), unit: 'years'};
};

/**
 * Gets the time string from elapsed time. Example: 2 hours ago.
 * @param {LanguageType} language Language object to get the string from.
 * @param {ElapsedTime} elapsed The elapsed time.
 * @param {'ago' | 'no_ago'} variant The variant of the string to get. Defaults to 'ago'.
 * @returns {string} The elapsed time string.
 */
export const getTimeStringFromElapsed = (
  language: LanguageType,
  elapsed: ElapsedTime,
  variant: 'ago' | 'no_ago' | 'short' = 'ago',
): string => {
  const {value, unit} = elapsed;

  if (unit === 'just_now') {
    return language.time[variant === 'short' ? 'just_now_short' : 'just_now'];
  }

  return parseLanguageParts(language.time[`${unit}_${variant}`], {time: value.toString()});
};

/**
 * Calculates the elapsed time between a timestamp and the current time
 * and gets the time string from it. Example: 2 hours ago.
 * @param {LanguageType} language Language object to get the string from.
 * @param {number} timestamp The timestamp to calculate the elapsed time from.
 * @param {number} currentTimestamp The current timestamp. Defaults to Date.now().
 * @param {'ago' | 'no_ago'} variant The variant of the string to get. Defaults to 'ago'.
 * @returns {string} The elapsed time string.
 */
export const getTimeStringFromTimestamp = (
  language: LanguageType,
  timestamp: number,
  currentTimestamp?: number,
  variant: 'ago' | 'no_ago' | 'short' = 'ago',
): string => {
  return getTimeStringFromElapsed(
    language,
    getElapsedFromTimestamp(timestamp, currentTimestamp),
    variant,
  );
};
