import {useEffect, EffectCallback} from 'react';

export const useOnMount = (effect: EffectCallback): void => {
  return useEffect(effect, []);
};
