import {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Text from '@/Components/Text';
import {useLanguage} from '@/Hooks/Language';
import {TextButtonProps} from './props';
import styles from './styles';

const TextButton: React.FC<TextButtonProps> = (props) => {
  const {children, showLoading, onPress, containerProps, ...textProps} = props;

  const language = useLanguage();
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
        {loading ? language.common.loading : children}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
