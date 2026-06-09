import {memo} from 'react';
import {Image} from 'expo-image';
import {FileApi} from '@/Api';
import {AvatarProps} from './props';

const Avatar: React.FC<AvatarProps> = (props) => {
  const {image, ...restProps} = props;

  if (image?.fileKey) {
    const ratio = image.width / image.height;
    return (
      <Image
        source={{uri: FileApi.getFileURL(image.fileKey)}}
        placeholder={{blurhash: image.blurhash ?? undefined, width: 32 * ratio, height: 32}}
        {...restProps}
      />
    );
  }

  return <Image source={require('../../Assets/Images/DefaultAvatar.png')} {...restProps} />;
};

export default memo(Avatar);
