import * as Languages from '../Languages';
import createContext from '../Utils/ContextCreator';
import {Selectors, useAppSelector} from '../Redux';

const {ContextProvider, useContext: useLanguage} = createContext(Languages.English);

export const LanguageProvider: typeof ContextProvider = ({children}) => {
  const settingsLanguage = useAppSelector(Selectors.Settings.Language);

  const languageName = settingsLanguage === 'default' ? 'English' : settingsLanguage;

  // ESLint can't compute the type of the Languages object
  // And since there's no issue with the code, we can disable the rule
  // eslint-disable-next-line import/namespace
  return <ContextProvider context={Languages[languageName]}>{children}</ContextProvider>;
};

export {useLanguage};
export type LanguageType = (typeof Languages)['English'];
