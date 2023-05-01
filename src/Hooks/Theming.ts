import {Theme} from '../Styles';
import createContext from '../Utils/ContextCreator';

const {
  ContextProvider: ThemeProvider,
  useContext: useTheme,
  useSetContext: useChangeTheme,
} = createContext(Theme.LightTheme);

export {ThemeProvider, useTheme, useChangeTheme};
export type ThemeType = typeof Theme.LightTheme;
