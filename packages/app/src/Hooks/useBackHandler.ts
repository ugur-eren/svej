import {useCallback} from 'react';
import {
  useFocusEffect,
  NavigationProp,
  ParamListBase,
  EventListenerCallback,
  EventMapCore,
  NavigationState,
} from '@react-navigation/native';

type CallbackEvent = EventListenerCallback<EventMapCore<NavigationState>, 'beforeRemove'>;
export type NavigationPropType = NavigationProp<ParamListBase>;
export type onBackCallback = (leavePage: () => void) => void;

export const useBackHandler = (navigation: NavigationPropType, onBack: onBackCallback): void => {
  return useFocusEffect(
    useCallback(() => {
      const callback: CallbackEvent = (e) => {
        e.preventDefault();

        onBack(() => navigation.dispatch(e.data.action));
      };

      navigation.addListener('beforeRemove', callback);

      return () => navigation.removeListener('beforeRemove', callback);
    }, [navigation, onBack]),
  );
};
