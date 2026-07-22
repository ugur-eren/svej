/* eslint @typescript-eslint/no-explicit-any: "off" */

import {createElement, memo} from 'react';
import {
  TouchableHighlight as RNTouchableHighlight,
  TouchableHighlightProps,
  View,
} from 'react-native';

const Touchable: React.FC<TouchableHighlightProps> = (props) => {
  const {children, style, ...restProps} = props;

  return createElement(
    RNTouchableHighlight as any,
    {
      underlayColor: 'rgba(0, 0, 0, 0.22)',
      ...restProps,
    },
    createElement(View, {style}, children),
  );
};

export default memo(Touchable);
