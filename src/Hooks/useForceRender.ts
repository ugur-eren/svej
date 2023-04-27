import {useCallback, useState} from 'react';

export const useForceRender = (): (() => void) => {
  const [, setState] = useState(Symbol('primitive state'));

  const forceRender = useCallback(() => {
    setState(Symbol('primitive state'));
  }, [setState]);

  return forceRender;
};
