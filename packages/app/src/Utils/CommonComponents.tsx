/* eslint @typescript-eslint/no-explicit-any: "off" */

import {Feather} from '@expo/vector-icons';
import {FeatherIconNames} from '../Types';

export const NullComponent = () => null;

export const PaperIconProp = (props: any) => <Feather {...props} />;

export const TabBarIcon =
  (name: FeatherIconNames) =>
  ({color}: {color: string}) =>
    <Feather name={name} color={color} size={20} />;

export const TabBarCompassIcon = TabBarIcon('compass');
export const TabBarPlusSquareIcon = TabBarIcon('plus-square');
export const TabBarBellIcon = TabBarIcon('bell');
export const TabBarUserIcon = TabBarIcon('user');
