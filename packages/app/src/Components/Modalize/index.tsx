import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Modalize as RNModalize, ModalizeProps} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IsIOS} from '@/Utils/Helpers';
import {useTheme} from '@/Hooks';
import getStyles from './styles';
import ModalizeTitle from './Title';

type Modalize = RNModalize;

interface Props extends ModalizeProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * A container for `react-native-modalize` library
 */
const _Modalize = React.forwardRef<RNModalize, Props>((props, ref) => {
  const {style: styleProp, children, ...restProps} = props;

  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <RNModalize
      ref={ref}
      handlePosition={IsIOS ? 'inside' : 'outside'}
      adjustToContentHeight
      {...restProps}
      modalStyle={styles.modal}
    >
      <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles.content, styleProp]}>
        {children}
      </SafeAreaView>
    </RNModalize>
  );
});

const Modalize: typeof _Modalize & {
  Title: typeof ModalizeTitle;
} = _Modalize as any;

Modalize.Title = ModalizeTitle;

export default Modalize;
