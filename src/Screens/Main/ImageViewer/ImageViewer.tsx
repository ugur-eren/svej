import {View} from 'react-native';
import {Image} from 'expo-image';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Header} from '../../../Components';
import {useTheme} from '../../../Hooks';
import {ImageViewerScreenProps} from '../../../Types';
import styles from './ImageViewer.styles';

const ImageViewer: React.FC<ImageViewerScreenProps> = (props) => {
  const {route} = props;

  const {title, image} = route.params;

  const theme = useTheme();

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = (e.rotation / Math.PI) * 180;
    })
    .onEnd(() => {
      rotation.value = withTiming(0);
    });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onUpdate((e) => {
      positionX.value = e.translationX;
      positionY.value = e.translationY;
    })
    .onEnd(() => {
      positionX.value = withTiming(0);
      positionY.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {rotateZ: `${rotation.value}deg`},
      {translateX: positionX.value},
      {translateY: positionY.value},
    ],
  }));

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Header title={title} />

      <View style={styles.container}>
        <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, rotationGesture, panGesture)}>
          <Animated.View style={animatedStyle}>
            <Image
              source={typeof image === 'string' ? {uri: image} : image}
              style={styles.image}
              contentFit="contain"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

export default ImageViewer;
