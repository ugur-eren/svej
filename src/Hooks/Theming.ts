import {Theme} from '../Styles';
import createContext from '../Utils/ContextCreator';

const {ContextProvider: ThemeProvider, useContext: useTheme} = createContext(Theme.LightTheme);

export {ThemeProvider, useTheme};
export type ThemeType = typeof Theme.LightTheme;
