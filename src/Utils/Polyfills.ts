export function SetStatePolyfill<T>(defaultValue: T) {
  const setState: React.Dispatch<React.SetStateAction<T>> = (setStateAction) => {
    return typeof setStateAction === 'function'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (setStateAction as any)(defaultValue)
      : setStateAction;
  };

  return setState;
}
