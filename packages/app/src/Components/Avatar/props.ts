import type {Media} from '@svej/database';
import {ImageProps} from 'expo-image';

export type AvatarProps = ImageProps & {
  image?: Media | null;
};
