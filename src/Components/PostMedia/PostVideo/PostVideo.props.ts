import {VideoProps} from 'expo-av';
import {PostData} from '../../PostContent/PostContent.props';

export type PostVideoProps = (PostData & {type: 'video'}) & VideoProps;
