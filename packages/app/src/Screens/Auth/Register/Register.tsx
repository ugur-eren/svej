import {Formik} from 'formik';
import {Config} from 'common';
import {AuthPage} from '../../../Containers';
import {Input} from '../../../Components';
import {useLanguage, useMutation} from '../../../Hooks';
import {AuthApi, UserApi} from '../../../Api';
import {AuthActions, useAppDispatch} from '../../../Redux';
import EmailValidator from '../../../Utils/EmailValidator';
import {parseLanguageParts} from '../../../Utils/Helpers';
import Storage from '../../../Utils/Storage';
import {AuthRegisterScreenProps} from '../../../Types';

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
  const dispatch = useAppDispatch();

  const registerMutation = useMutation({
    mutationFn: UserApi.register,
  });
  const loginMutation = useMutation({
    mutationFn: AuthApi.login,
  });

  const validateForm = (values: typeof initialValues) => {
    const errors: Partial<typeof initialValues> = {};

    if (values.username.trim().length < Config.usernameMinLength) {
      errors.username = parseLanguageParts(language.errors.USERNAME_SHORT, {
        min: Config.usernameMinLength,
      });
    }

    if (values.password.length < Config.passwordMinLength) {
      errors.password = parseLanguageParts(language.errors.PASSWORD_SHORT, {
        min: Config.passwordMinLength,
      });
    }
    if (values.password !== values.passwordValidation) {
      errors.passwordValidation = language.errors.PASSWORDS_NOT_MATCH;
    }

    if (!EmailValidator(values.email.trim())) errors.email = language.errors.EMAIL_INVALID;

    return errors;
  };

  const onFormSubmit = async (values: typeof initialValues) => {
    try {
      const registerResult = await registerMutation.mutateAsync(values);

      const loginResult = await loginMutation.mutateAsync({
        username: registerResult.username,
        password: values.password,
      });

      dispatch(AuthActions.setAuthenticated(true));
      dispatch(AuthActions.setUser(loginResult.user));

      await Storage.set('token', loginResult.token);

      navigation.navigate('MainStack', {screen: 'BottomStack', params: {screen: 'Explore'}});
    } catch (error) {
      // Mutation alreadys shows the error, no need to do anything here
    }
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
                type="email"
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
