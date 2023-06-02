import {createContext as createReactContext, useContext as useReactContext} from 'react';

type ContextProviderType<T> = React.FC<{
  children: React.ReactNode;
  context?: T;
}>;

type ContextType<T> = {
  ContextProvider: ContextProviderType<T>;
  Context: React.Context<T>;
  useContext(): T;
};

function createContextProvider<T>(
  defaultContext: T,
  Context: ContextType<T>['Context'],
): ContextProviderType<T> {
  const ContextProvider: ContextProviderType<T> = (props) => {
    const {context = defaultContext, children} = props;

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return ContextProvider;
}

function createContext<T>(defaultContext: T): ContextType<T> {
  const Context: ContextType<T>['Context'] = createReactContext(defaultContext);

  const ContextProvider: ContextProviderType<T> = createContextProvider(defaultContext, Context);

  const useContext = (): T => {
    return useReactContext(Context);
  };

  return {
    ContextProvider,
    Context,
    useContext,
  };
}

export default createContext;
