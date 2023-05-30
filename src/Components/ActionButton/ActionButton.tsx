import {memo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import Text from '../Text/Text';
import Spinner from '../Spinner/Spinner';
import {useTheme} from '../../Hooks';
import {ActionButtonProps} from './ActionButton.props';
import styles from './ActionButton.styles';

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const {type, active, count, small, showLoading = true, onPress, containerStyle} = props;

  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  let buttonColor = theme.colors.text;
  if (active) {
    buttonColor = {
      like: theme.colors.success,
      dislike: theme.colors.error,
      repost: theme.colors.primary,
    }[type];
  }

  const buttonIcon = {
    like: 'thumbs-up',
    dislike: 'thumbs-down',
    repost: 'repeat',
  }[type];

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
    <View style={StyleSheet.compose(styles.container, containerStyle)}>
      {loading ? (
        <Spinner size={small ? 18 : 22} color="primary" style={styles.loading} />
      ) : (
        <IconButton
          icon={buttonIcon}
          iconColor={buttonColor}
          onPress={onButtonPress}
          size={small ? 18 : 22}
        />
      )}

      <Text fontSize={small ? 14 : 16}>{count}</Text>
    </View>
  );
};

export default memo(ActionButton);
