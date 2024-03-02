import {Config} from 'common';
import {ScrollView} from 'react-native';
import {Formik} from 'formik';
import {Button, Header, Input} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useMutation, useShowToast, useTheme} from '../../../Hooks';
import {UserApi} from '../../../Api';
import {parseLanguageParts} from '../../../Utils/Helpers';
import {SettingsChangePasswordScreenProps} from '../../../Types';
import getStyles from './ChangePassword.styles';

const initialValues = {
  currentPassword: '',
  newPassword: '',
  newPasswordValidation: '',
};

const ChangePassword: React.FC<SettingsChangePasswordScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const language = useLanguage();
  const showToast = useShowToast();

  const mutation = useMutation({
    mutationFn: UserApi.changePassword,
  });

  const styles = getStyles(theme);

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<typeof initialValues> = {};

    if (!values.currentPassword) errors.currentPassword = language.errors.PASSWORD_REQUIRED;
    if (values.newPassword.length < 6)
      errors.newPassword = parseLanguageParts(language.errors.PASSWORD_SHORT, {
        min: Config.passwordMinLength,
      });
    if (values.newPassword !== values.newPasswordValidation)
      errors.newPasswordValidation = language.errors.PASSWORDS_NOT_MATCH;

    return errors;
  };

  const onFormSubmit = async (values: typeof initialValues) => {
    try {
      await mutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        newPasswordConfirm: values.newPasswordValidation,
      });

      navigation.goBack();

      showToast({
        type: 'success',
        title: language.settings.password_changed_title,
        message: language.settings.password_changed_message,
      });
    } catch (error) {
      // Mutations handle errors automatically, so we don't need to do anything here.
    }
  };

  return (
    <PageContainer>
      <Header title={language.settings.change_password} />

      <ScrollView
        style={styles.container}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Formik initialValues={initialValues} validate={validateForm} onSubmit={onFormSubmit}>
          {({handleSubmit, handleChange, handleBlur, values, errors}) => (
            <>
              <Input
                placeholder={language.auth.currentPassword}
                value={values.currentPassword}
                onChangeText={handleChange('currentPassword')}
                onBlur={handleBlur('currentPassword')}
                error={errors.currentPassword}
                leftIcon="lock"
                type="password"
                small
              />

              <Input
                placeholder={language.auth.password}
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                error={errors.newPassword}
                leftIcon="lock"
                type="password"
                small
              />

              <Input
                placeholder={language.auth.passwordValidation}
                value={values.newPasswordValidation}
                onChangeText={handleChange('newPasswordValidation')}
                onBlur={handleBlur('newPasswordValidation')}
                error={errors.newPasswordValidation}
                leftIcon="lock"
                type="password"
                small
              />

              <Button
                title={language.settings.change_password}
                showLoading
                onPress={handleSubmit}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </PageContainer>
  );
};

export default ChangePassword;
