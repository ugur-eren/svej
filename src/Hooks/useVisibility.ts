import {useContext, createContext} from 'react';

export const VisibilityContext = createContext<boolean | null>(null);

export const useVisibility = () => {
  return useContext(VisibilityContext);
};
