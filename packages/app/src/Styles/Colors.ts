export const CommonColors = {
  // black, white and center variants may be used for gradients or other purposes
  transparent: 'transparent',
  blackTransparent: 'rgba(0, 0, 0, 0)',
  whiteTransparent: 'rgba(255, 255, 255, 0)',
  centerTransparent: 'rgba(127, 127, 127, 0)',

  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
};

export const LightThemeColors = {
  colors: {
    ...CommonColors,

    primary: '#FA8057',
    background: '#F0F0F0',
    surface: '#FAFAFA',
    elevated: '#FFFFFF',

    text: '#242424',
    textLight: '#9F9F9F',
    textStrong: '#212121',
    onPrimary: '#FAFAFA',

    bottomBarTint: '#FA8057',
    bottomBarActive: '#FFFFFF',
    bottomBarInactive: '#FA8057',

    buttonBackground: '#FA8057',
    buttonText: '#FAFAFA',

    inputBackground: '#F7F9FC',
    inputBorder: '#EEF2F7',
    inputPlaceholder: '#737985',

    success: '#44D775',
    error: '#ff4747',
    info: '#1979ff',
    warning: '#fcbd00',
  },
  gradients: {
    primary: ['#FA8057', '#F94D1D', '#F94D1D', '#F94D1D', '#FA8057'],
  },
};

export const DarkThemeColors = {
  colors: {
    ...CommonColors,

    primary: '#FA8057',
    background: '#202020',
    surface: '#242424',
    elevated: '#272727',

    text: '#FAFAFA',
    textLight: '#A0A0A0',
    textStrong: '#DEDEDE',
    onPrimary: '#FAFAFA',

    bottomBarTint: '#FA8057',
    bottomBarActive: '#FFFFFF',
    bottomBarInactive: '#FA8057',

    buttonBackground: '#FA8057',
    buttonText: '#FAFAFA',

    inputBackground: '#272727',
    inputBorder: '#3D3D3D',
    inputPlaceholder: '#BABABA',

    success: '#44D775',
    error: '#ff4747',
    info: '#1979ff',
    warning: '#fcbd00',
  },
  gradients: {
    primary: ['#FA8057', '#F94D1D', '#F94D1D', '#F94D1D', '#FA8057'],
  },
};
