import {Formik} from 'formik';
import {AuthPage} from '../../../Containers';
import {Input} from '../../../Components';
import {useLanguage} from '../../../Hooks';
import EmailValidator from '../../../Utils/EmailValidator';
import {AuthRegisterScreenProps} from '../../../Typings/NavigationTypes';

type Props = AuthRegisterScreenProps;

const initialValues = {
  username: '',
  fullname: '',
  email: '',
  password: '',
  passwordValidation: '',
};

const Register: React.FC<Props> = ({navigation}) => {
  const language = useLanguage();

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<typeof initialValues> = {};

    if (values.username.trim().length < 4) errors.username = language.errors.USERNAME_SHORT;

    if (values.password.length < 4) errors.password = language.errors.PASSWORD_SHORT;
    if (values.password !== values.passwordValidation)
      errors.passwordValidation = language.errors.PASSWORDS_NOT_MATCH;

    if (!EmailValidator(values.email.trim())) errors.email = language.errors.EMAIL_INVALID;

    return errors;
  };

  const onFormSubmit = (values: typeof initialValues) => {
    // TODO: handle register
  };

  return (
    <AuthPage.Container>
      <AuthPage.Header title={language.common.register} />

      <Formik initialValues={initialValues} validate={validateForm} onSubmit={onFormSubmit}>
        {({handleSubmit, handleChange, handleBlur, values, errors}) => (
          <>
            <AuthPage.Content>
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
                small
              />

              <Input
                placeholder={language.auth.password}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                leftIcon="lock"
                type="password"
                small
              />

              <Input
                placeholder={language.auth.passwordValidation}
                value={values.passwordValidation}
                onChangeText={handleChange('passwordValidation')}
                onBlur={handleBlur('passwordValidation')}
                error={errors.passwordValidation}
                leftIcon="lock"
                type="password"
                small
              />
            </AuthPage.Content>

            <AuthPage.Footer
              buttonTitle={language.common.register}
              contentTitle={language.auth.alreadyHaveAccount}
              contentSubtitle={language.common.login}
              onButtonPress={handleSubmit}
              onContentPress={() => navigation.navigate('Login')}
            />
          </>
        )}
      </Formik>
    </AuthPage.Container>
  );
};

export default Register;
