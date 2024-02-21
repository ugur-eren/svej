import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {Theme} from '../Styles';
import createContext from '../Utils/ContextCreator';
import {Selectors, useAppSelector} from '../Redux';

const {ContextProvider, useContext: useTheme} = createContext(Theme.LightTheme);

export const ThemeProvider: typeof ContextProvider = ({children}) => {
  const defaultColorScheme = useColorScheme();
  const settingsTheme = useAppSelector(Selectors.Settings.Theme);

  const colorScheme = settingsTheme === 'default' ? defaultColorScheme : settingsTheme;
  const theme = useMemo(
    () => (colorScheme === 'dark' ? Theme.DarkTheme : Theme.LightTheme),
    [colorScheme],
  );

  return <ContextProvider context={theme}>{children}</ContextProvider>;
};

export {useTheme};
export type ThemeType = typeof Theme.LightTheme;
