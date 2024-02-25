import {memo} from 'react';
import {Image} from 'expo-image';
import {FileApi} from '../../Api';
import {AvatarProps} from './Avatar.props';

const Avatar: React.FC<AvatarProps> = (props) => {
  const {avatarKey, ...restProps} = props;

  if (avatarKey) {
    return <Image source={{uri: FileApi.getFileURL(avatarKey)}} {...restProps} />;
  }

  return <Image source={require('../../Assets/Images/DefaultAvatar.png')} {...restProps} />;
};

export default memo(Avatar);
