import {useState, createContext as createReactContext, useContext as useReactContext} from 'react';
import {SetStatePolyfill} from './Polyfills';

type ContextProviderType<T> = React.FC<{
  children: React.ReactNode;
  context?: T;
}>;

type ContextType<T> = {
  ContextProvider: ContextProviderType<T>;
  Context: React.Context<[T, React.Dispatch<React.SetStateAction<T>>]>;
  useContext(): T;
  useSetContext(): React.Dispatch<React.SetStateAction<Partial<T>>>;
};

function createContextProvider<T>(
  defaultContext: T,
  Context: ContextType<T>['Context'],
): ContextProviderType<T> {
  const ContextProvider: ContextProviderType<T> = (props) => {
    const {context: contextProp = defaultContext, children} = props;

    const context = useState(contextProp);

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return ContextProvider;
}

function createContext<T>(defaultContext: T): ContextType<T> {
  const Context: ContextType<T>['Context'] = createReactContext([
    defaultContext,
    SetStatePolyfill(defaultContext),
  ]);

  const ContextProvider: ContextProviderType<T> = createContextProvider(defaultContext, Context);

  const useContext = (): T => {
    return useReactContext(Context)[0];
  };

  const useSetContext = (): React.Dispatch<React.SetStateAction<T>> => {
    const setState = useReactContext(Context)[1];

    return (value) => {
      setState((prev) => {
        if (typeof value === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return {...prev, ...(value as any)(prev)};
        }

        return {...prev, ...value};
      });
    };
  };

  return {
    ContextProvider,
    Context,
    useContext,
    useSetContext: useSetContext as unknown as () => React.Dispatch<
      React.SetStateAction<Partial<T>>
    >,
  };
}

export default createContext;
