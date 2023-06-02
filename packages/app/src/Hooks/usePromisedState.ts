import {SetStateAction, useState, useRef, useEffect} from 'react';

export const usePromisedState = <T>(
  initialState: T,
): [T, (stateAction: SetStateAction<T>) => Promise<T>] => {
  const [state, setState] = useState(initialState);
  const readyPromiseResolverRef = useRef<((currentState: T) => void) | null>(null);

  useEffect(() => {
    if (readyPromiseResolverRef.current) {
      readyPromiseResolverRef.current(state);
      readyPromiseResolverRef.current = null;
    }
  }, [readyPromiseResolverRef, state]);

  const handleSetState = (stateAction: SetStateAction<T>) => {
    setState(stateAction);
    return new Promise((resolve) => {
      readyPromiseResolverRef.current = resolve;
    }) as Promise<T>;
  };

  return [state, handleSetState];
};
