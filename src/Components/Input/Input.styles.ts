import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';

export default ThemedStyleSheet((theme, multiline: boolean, error: boolean) => ({
  container: {
    marginBottom: 21,
  },
  inner: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: theme.colors.inputBackground,
    borderColor: error ? theme.colors.error : theme.colors.inputBorder,
    height: 49,

    ...(multiline && {
      alignItems: 'flex-start',
      height: 'auto',
    }),
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.text,

    ...(multiline && {
      minHeight: 100,
      textAlignVertical: 'top',
    }),
  },
  leftIconStyle: {
    marginRight: 10,

    ...(multiline && {top: 10}),
  },
  rightIconStyle: {
    marginLeft: 10,
    marginRight: 0,

    ...(multiline && {top: 10}),
  },
  errorText: {
    marginTop: 3,
  },
}));
