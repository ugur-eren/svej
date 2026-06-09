import {useEffect, useState} from 'react';
import {useRotateToken} from './useRotateToken';

export const useInitializeApp = () => {
  const [initialized, setInitialized] = useState(false);
  const rotateToken = useRotateToken();

  useEffect(() => {
    (async () => {
      await rotateToken();

      setInitialized(true);
    })();
  }, [rotateToken]);

  return initialized;
};
