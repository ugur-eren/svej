// https://github.com/Bedrock-Layouts/Bedrock/blob/main/packages/use-forwarded-ref/src/index.tsx

import {useImperativeHandle, useRef} from 'react';

export const useForwardedRef = <T>(
  forwardedRef: React.ForwardedRef<T>,
): React.MutableRefObject<T> => {
  const innerRef = useRef<T>();

  useImperativeHandle(forwardedRef, () => innerRef.current as T);

  return innerRef as React.MutableRefObject<T>;
};
