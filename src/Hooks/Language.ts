import {English} from '../Languages';
import createContext from '../Utils/ContextCreator';

const {
  ContextProvider: LanguageProvider,
  useContext: useLanguage,
  useSetContext: useChangeLanguage,
} = createContext(English);

export {LanguageProvider, useLanguage, useChangeLanguage};
export type LanguageType = typeof English;
