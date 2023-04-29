import {ImageProps} from 'expo-image';
import {PostData} from '../../PostContent/PostContent.props';

export type PostImageProps = (PostData & {type: 'image'}) & ImageProps;
