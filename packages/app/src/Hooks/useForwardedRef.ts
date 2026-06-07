import {useImperativeHandle, useRef} from 'react';

export const useForwardedRef = <T>(forwardedRef: React.ForwardedRef<T>): React.RefObject<T> => {
  const innerRef = useRef<T>(undefined);

  useImperativeHandle(forwardedRef, () => innerRef.current as T);

  return innerRef as React.RefObject<T>;
};
