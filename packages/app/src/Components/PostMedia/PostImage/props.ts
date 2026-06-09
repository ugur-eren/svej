import {ImageProps} from 'expo-image';
import {PostData} from '@/Components/PostContent/props';

export type PostImageProps = (PostData & {type: 'image'}) & ImageProps;
