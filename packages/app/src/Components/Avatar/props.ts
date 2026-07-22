import {ImageProps} from 'expo-image';
import {MediasApi} from '@/Api';

export type AvatarProps = ImageProps & {
  image?: MediasApi.Avatar | null;
};
