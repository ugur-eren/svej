import {ScrollView} from 'react-native';
import {Formik} from 'formik';
import {Config} from 'common';
import {Button, Header, Input} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useTheme} from '../../../Hooks';
import EmailValidator from '../../../Utils/EmailValidator';
import {parseLanguageParts} from '../../../Utils/Helpers';
import {SettingsEditProfileScreenProps} from '../../../Types';
import getStyles from './EditProfile.styles';

const initialValues = {
  username: '',
  fullname: '',
  email: '',
  bio: '',
};

const EditProfile: React.FC<SettingsEditProfileScreenProps> = () => {
  const theme = useTheme();
  const language = useLanguage();

  const styles = getStyles(theme);

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<typeof initialValues> = {};

    if (values.username.trim().length < Config.usernameMinLength) {
      errors.username = parseLanguageParts(language.errors.USERNAME_SHORT, {
        min: Config.usernameMinLength,
      });
    }

    if (!EmailValidator(values.email.trim())) errors.email = language.errors.EMAIL_INVALID;

    return errors;
  };

  const onFormSubmit = (values: typeof initialValues) => {
    // TODO: handle register
  };

  return (
    <PageContainer>
      <Header title={language.settings.edit_profile} />

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
                placeholder={language.auth.username}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                error={errors.username}
                leftIcon="tag"
                small
              />

              <Input
                placeholder={language.auth.fullname}
                value={values.fullname}
                onChangeText={handleChange('fullname')}
                onBlur={handleBlur('fullname')}
                error={errors.fullname}
                leftIcon="user"
                small
              />

              <Input
                placeholder={language.auth.email}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                leftIcon="at-sign"
                type="email"
                small
              />

              <Input
                placeholder={language.auth.bio}
                value={values.bio}
                onChangeText={handleChange('bio')}
                onBlur={handleBlur('bio')}
                error={errors.bio}
                leftIcon="hash"
                multiline
              />

              <Button title={language.settings.edit_profile} showLoading onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </ScrollView>
    </PageContainer>
  );
};

export default EditProfile;
