import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Text from '@/Components/Text';
import ActivityIndicator from '@/Components/Spinner';
import GradientOrView from '@/Components/GradientOrView';
import {useTheme} from '@/Hooks';
import {ButtonProps} from './props';
import styles from './styles';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    title,
    showLoading = true,
    onPress,
    backgroundColor,
    color = 'buttonText',

    style: styleProp,
    containerStyle: containerStyleProp,
    textStyle: textStyleProp,
    textContainerStyle: textContainerStyleProp,
    backgroundStyle: backgroundStyleProp,
  } = props;

  const theme = useTheme();

  const [loading, setLoading] = useState(false);

  const onButtonPress = async () => {
    if (!onPress) return;

    if (showLoading) {
      if (!loading) {
        const result = onPress();

        if (result instanceof Promise) {
          setLoading(true);
          await result;
          setLoading(false);
        }
      }
    } else {
      await onPress();
    }
  };

  return (
    <View style={StyleSheet.compose(styles.container, containerStyleProp)}>
      <GradientOrView
        colors={
          typeof backgroundColor === 'string'
            ? theme.colors[backgroundColor]
            : backgroundColor || theme.gradients.primary
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.compose(styles.background, backgroundStyleProp)}
      >
        <TouchableRipple
          style={StyleSheet.compose(styles.touchable, styleProp)}
          onPress={onPress ? onButtonPress : undefined}
        >
          <View style={StyleSheet.compose(styles.inner, textContainerStyleProp)}>
            <ActivityIndicator
              animating={loading}
              size="small"
              style={styles.spinner}
              color={color}
            />

            <Text
              weight="bold"
              color={color}
              fontSize={16}
              style={StyleSheet.compose(styles.text, textStyleProp)}
            >
              {title}
            </Text>
          </View>
        </TouchableRipple>
      </GradientOrView>
    </View>
  );
};

export default Button;
