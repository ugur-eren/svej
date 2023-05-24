import {View} from 'react-native';
import {Image} from 'expo-image';
import {Header} from '../../../Components';
import {useTheme} from '../../../Hooks';
import {ImageViewerScreenProps} from '../../../Types';
import styles from './ImageViewer.styles';

// TODO: Make this component a proper image viewer with zooming and panning

const ImageViewer: React.FC<ImageViewerScreenProps> = (props) => {
  const {route} = props;

  const {title, image} = route.params;

  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Header title={title} />

      <View style={styles.container}>
        <Image
          source={typeof image === 'string' ? {uri: image} : image}
          style={styles.image}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

export default ImageViewer;
