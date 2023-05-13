import {useEffect, EffectCallback} from 'react';

export const useOnMount = (effect: EffectCallback): void => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, []);
};
