import {ThemedStyleSheet} from '../../Utils/ThemedStyleSheet';
import {Spacing} from '../../Styles';

export default ThemedStyleSheet((theme, multiline: boolean, error: boolean) => ({
  container: {
    marginBottom: Spacing.normal,
  },
  inner: {
    borderWidth: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.small,
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
      maxHeight: 250,
      textAlignVertical: 'top',
      paddingTop: Spacing.small,
      paddingBottom: Spacing.small,
    }),
  },
  leftIconStyle: {
    marginRight: Spacing.small,

    ...(multiline && {top: Spacing.small}),
  },
  rightIconStyle: {
    marginLeft: Spacing.small,
    marginRight: 0,

    ...(multiline && {top: Spacing.small}),
  },
  errorText: {
    marginTop: 3,
  },
}));
