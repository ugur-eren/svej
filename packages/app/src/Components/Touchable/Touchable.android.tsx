/* eslint @typescript-eslint/no-explicit-any: "off" */

import {createElement, memo} from 'react';
import {TouchableHighlightProps, TouchableNativeFeedback, View} from 'react-native';

const Touchable: React.FC<TouchableHighlightProps> = (props) => {
  const {children, style, ...restProps} = props;

  return createElement(
    TouchableNativeFeedback as any,
    {background: TouchableNativeFeedback.Ripple('rgba(0,0,0,0.2)', false), ...restProps},
    createElement(View, {style}, children),
  );
};

export default memo(Touchable);
