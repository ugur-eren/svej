/* eslint @typescript-eslint/no-explicit-any: "off" */

import {createElement, memo, Fragment} from 'react';
import {TouchableHighlight as RNTouchableHighlight, TouchableHighlightProps} from 'react-native';

const Touchable: React.FC<TouchableHighlightProps> = (props) => {
  const {children, ...restProps} = props;

  return createElement(
    RNTouchableHighlight as any,
    {
      underlayColor: 'rgba(0, 0, 0, 0.22)',
      ...restProps,
    },
    createElement(Fragment, {}, children),
  );
};

export default memo(Touchable);
