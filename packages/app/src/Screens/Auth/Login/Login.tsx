import {Formik} from 'formik';
import {Config} from 'common';
import {AuthPage} from '../../../Containers';
import {Input, TextButton} from '../../../Components';
import {useLanguage} from '../../../Hooks';
import {parseLanguageParts} from '../../../Utils/Helpers';
import {AuthLoginScreenProps} from '../../../Types';
import {AuthActions, useAppDispatch} from '../../../Redux';
import Storage from '../../../Utils/Storage';

type Props = AuthLoginScreenProps;

const initialValues = {
  username: '',
  password: '',
};

const Login: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const language = useLanguage();

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

    return errors;
  };

  const onFormSubmit = async (values: typeof initialValues) => {
    // TODO: validate and do the login

    dispatch(AuthActions.setAuthenticated(true));
    dispatch(AuthActions.setUser());
    await Storage.set('token', 'JWT Auth Token');

    navigation.replace('MainStack', {screen: 'BottomStack', params: {screen: 'Explore'}});
  };

  return (
    <AuthPage.Container>
      <AuthPage.Header title={language.common.login} />

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
                leftIcon="user"
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

              <TextButton>{language.auth.forgotPassword}</TextButton>
            </AuthPage.Content>

            <AuthPage.Footer
              buttonTitle={language.common.login}
              contentTitle={language.auth.dontHaveAnAccount}
              contentSubtitle={language.common.register}
              onButtonPress={handleSubmit}
              onContentPress={() => navigation.navigate('Register')}
            />
          </>
        )}
      </Formik>
    </AuthPage.Container>
  );
};

export default Login;
