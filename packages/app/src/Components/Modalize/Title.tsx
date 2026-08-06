import React from 'react';
import {StyleSheet} from 'react-native';
import {Spacing} from '@/Styles';
import Text from '../Text';
import {TextProps} from '../Text/props';

const ModalizeTitle: React.FC<TextProps> = (props) => {
  const {children, style: textStyle, ...restProps} = props;

  return React.createElement(
    Text,
    {
      color: 'textStrong',
      fontSize: 18,
      weight: 'bold',
      style: [styles.title, textStyle],
      ...restProps,
    },
    children,
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: Spacing.medium,
  },
});

export default ModalizeTitle;
