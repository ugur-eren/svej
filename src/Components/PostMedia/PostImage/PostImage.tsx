import {useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Image, ImageStyle} from 'expo-image';
import {useSharedValue} from 'react-native-reanimated';
import {PostImageProps} from './PostImage.props';
import styles from './PostImage.styles';
import CircleProgress from '../../CircleProgress/CircleProgress';

const PostImage: React.FC<PostImageProps> = (props) => {
  const {uri, ratio, thumbnail, style, ...imageProps} = props;

  const {width} = useWindowDimensions();

  const [loading, setLoading] = useState(true);
  const progress = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Image
        source={{uri}}
        placeholder={thumbnail}
        transition={500}
        contentFit="contain"
        onProgress={(e) => {
          progress.value = e.loaded / e.total;
        }}
        onLoad={() => setLoading(false)}
        style={StyleSheet.compose(style, {width, height: width / ratio}) as ImageStyle}
        {...imageProps}
      />

      {loading ? (
        <View style={styles.loader}>
          <CircleProgress
            width={100}
            height={100}
            progress={progress}
            radius={50}
            strokeWidth={5}
          />
        </View>
      ) : null}
    </View>
  );
};

export default PostImage;
