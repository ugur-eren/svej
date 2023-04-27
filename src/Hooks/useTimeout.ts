import {useRef} from 'react';

type SetTimeoutType = <T extends unknown[]>(
  handler: (...args: T) => unknown,
  timeoutInMS: number,
  ...args: T
) => void;

type ClearTimeoutType = () => void;

export const useTimeout = (): [set: SetTimeoutType, clear: ClearTimeoutType] => {
  const timeout = useRef<NodeJS.Timeout>();

  const set: SetTimeoutType = (handler, timeoutInMS, ...args) => {
    timeout.current = setTimeout(handler, timeoutInMS, ...args);
  };

  const clear: ClearTimeoutType = () => {
    if (timeout.current !== undefined) {
      clearTimeout(timeout.current);
    }
  };

  return [set, clear];
};
