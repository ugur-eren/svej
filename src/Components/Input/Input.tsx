import {useState, useCallback, memo} from 'react';
import {View, TextInput, StyleSheet, KeyboardType} from 'react-native';
import {IconButton} from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import Text from '../Text/Text';
import {useTheme} from '../../Hooks';
import {OnlyNumericPad} from '../../Utils/Helpers';
import {InputProps} from './Input.props';
import getStyles from './Input.styles';

const Input: React.FC<InputProps> = (props) => {
  const {
    value,
    placeholder,
    error,
    small,
    multiline,
    type,
    leftIcon,
    rightIcon,
    onLeftIconPress,
    onRightIconPress,
    style: styleProp,
    containerStyle: containerStyleProp,
    inputStyle: inputStyleProp,
    leftIconStyle: leftIconStyleProp,
    rightIconStyle: rightIconStyleProp,
    ...inputProps
  } = props;

  const theme = useTheme();
  const [passwordShown, setPasswordShown] = useState(false);

  const styles = getStyles(theme, !!multiline, !!error);

  let keyboardType: KeyboardType = 'default';
  if (type === 'number') keyboardType = OnlyNumericPad;
  if (type === 'email') keyboardType = 'email-address';

  const onPasswordPress = useCallback(() => {
    setPasswordShown((current) => !current);
  }, []);

  return (
    <View style={StyleSheet.compose(styles.container, containerStyleProp)}>
      <View style={StyleSheet.compose(styles.inner, styleProp)}>
        {leftIcon ? (
          <Feather
            name={leftIcon}
            size={23}
            color={theme.colors.textLight}
            style={StyleSheet.compose(styles.leftIconStyle, leftIconStyleProp)}
            onPress={onLeftIconPress}
          />
        ) : null}

        <TextInput
          value={value}
          placeholder={placeholder}
          style={StyleSheet.compose(styles.input, inputStyleProp)}
          multiline={multiline}
          placeholderTextColor={theme.colors.textLight}
          keyboardAppearance={theme.dark ? 'dark' : 'default'}
          secureTextEntry={type === 'password' && !passwordShown}
          keyboardType={keyboardType}
          autoCapitalize={type === 'password' || small ? 'none' : 'sentences'}
          underlineColorAndroid={theme.colors.blackTransparent}
          {...inputProps}
        />

        {type === 'password' ? (
          <IconButton
            icon={passwordShown ? 'eye-off' : 'eye'}
            size={23}
            iconColor={theme.colors.textLight}
            style={StyleSheet.compose(styles.rightIconStyle, rightIconStyleProp)}
            onPress={onPasswordPress}
          />
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {rightIcon ? (
              <Feather
                name={rightIcon}
                size={23}
                color={theme.colors.textLight}
                style={StyleSheet.compose(styles.rightIconStyle, rightIconStyleProp)}
                onPress={onRightIconPress}
              />
            ) : null}
          </>
        )}
      </View>

      {error ? (
        <Text color="error" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default memo(Input);
