import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Image, ImageStyle} from 'expo-image';
import {PostImageProps} from './PostImage.props';
import styles from './PostImage.styles';

const PostImage: React.FC<PostImageProps> = (props) => {
  const {uri, ratio, thumbnail, style, ...imageProps} = props;

  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={{uri}}
        placeholder={thumbnail}
        transition={500}
        contentFit="contain"
        style={StyleSheet.compose(style, {width, height: width / ratio}) as ImageStyle}
        {...imageProps}
      />

      {/* TODO: Add loading indicator */}
    </View>
  );
};

export default PostImage;
