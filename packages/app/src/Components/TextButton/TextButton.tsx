import {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TextButtonProps} from './TextButton.props';
import styles from './TextButton.styles';
import Text from '../Text/Text';

const TextButton: React.FC<TextButtonProps> = (props) => {
  const {children, showLoading, onPress, containerProps, ...textProps} = props;

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
    <TouchableOpacity
      {...containerProps}
      onPress={onButtonPress}
      style={StyleSheet.compose(styles.container, containerProps?.style)}
    >
      <Text {...textProps} color={loading ? 'textLight' : textProps?.color}>
        {/* TODO: Get the loading text from language context */}
        {loading ? 'Loading...' : children}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
