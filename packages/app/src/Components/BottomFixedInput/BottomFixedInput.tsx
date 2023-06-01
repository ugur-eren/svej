import {memo} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Surface} from 'react-native-paper';
import InputAccessoryView from '../InputAccessoryView/InputAccessoryView';
import {useTheme} from '../../Hooks';
import {BottomFixedInputProps} from './BottomFixedInput.props';
import getStyles from './BottomFixedInput.styles';

const BottomFixedInput: React.FC<BottomFixedInputProps> = (props) => {
  const {left, right, containerProps, style: styleProp, ...inputProps} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <Surface elevation={2} mode="elevated">
      <SafeAreaView
        edges={['bottom']}
        {...containerProps}
        style={StyleSheet.compose(styles.container, containerProps?.style)}
      >
        <InputAccessoryView style={styles.container}>
          <View style={styles.container}>
            {left}

            <TextInput
              style={StyleSheet.compose(styles.input, styleProp)}
              placeholderTextColor={theme.colors.textLight}
              keyboardAppearance={theme.dark ? 'dark' : 'default'}
              {...inputProps}
            />

            {right}
          </View>
        </InputAccessoryView>
      </SafeAreaView>
    </Surface>
  );
};

export default memo(BottomFixedInput);
