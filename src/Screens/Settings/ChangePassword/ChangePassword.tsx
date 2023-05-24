import {ScrollView} from 'react-native';
import {Formik} from 'formik';
import {Button, Header, Input} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useTheme} from '../../../Hooks';
import {SettingsChangePasswordScreenProps} from '../../../Types';
import getStyles from './ChangePassword.styles';

const initialValues = {
  currentPassword: '',
  newPassword: '',
  newPasswordValidation: '',
};

const ChangePassword: React.FC<SettingsChangePasswordScreenProps> = () => {
  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<typeof initialValues> = {};

    if (!values.currentPassword) errors.currentPassword = language.errors.PASSWORD_REQUIRED;
    if (values.newPassword.length < 6) errors.newPassword = language.errors.PASSWORD_SHORT;
    if (values.newPassword !== values.newPasswordValidation)
      errors.newPasswordValidation = language.errors.PASSWORDS_NOT_MATCH;

    return errors;
  };

  const onFormSubmit = (values: typeof initialValues) => {
    // TODO: handle register
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
