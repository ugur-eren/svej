import {memo} from 'react';
import {Image} from 'expo-image';
import {AvatarProps} from './Avatar.props';

const Avatar: React.FC<AvatarProps> = (props) => {
  const {avatar, ...restProps} = props;

  if (avatar) {
    return <Image source={{uri: avatar}} {...restProps} />;
  }

  return <Image source={require('../../Assets/Images/DefaultAvatar.png')} {...restProps} />;
};

export default memo(Avatar);
