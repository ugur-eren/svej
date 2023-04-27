import {English} from '../Languages';
import createContext from '../Utils/ContextCreator';

const {ContextProvider: LanguageProvider, useContext: useLanguage} = createContext(English);

export {LanguageProvider, useLanguage};
export type LanguageType = typeof English;
