import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Image, ImageStyle} from 'expo-image';
import {PostImageProps} from './PostImage.props';

const PostImage: React.FC<PostImageProps> = (props) => {
  const {uri, ratio, thumbnail, style, ...imageProps} = props;

  const {width} = useWindowDimensions();

  return (
    <View>
      <Image
        source={{uri}}
        placeholder={thumbnail}
        transition={500}
        style={StyleSheet.compose(style, {height: width / ratio}) as ImageStyle}
        {...imageProps}
      />

      {/* TODO: Add loading indicator */}
    </View>
  );
};

export default PostImage;
