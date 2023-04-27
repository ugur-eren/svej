// https://github.com/Bedrock-Layouts/Bedrock/blob/main/packages/use-forwarded-ref/src/index.tsx

import {useEffect, useRef} from 'react';

export const useForwardedRef = <T>(
  forwardedRef: React.ForwardedRef<T>,
): React.MutableRefObject<T | null> => {
  const innerRef = useRef<T>(null) as React.MutableRefObject<T | null>;

  useEffect(() => {
    if (!forwardedRef) return;

    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
};
