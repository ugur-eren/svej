import {ScrollView, View} from 'react-native';
import {Formik} from 'formik';
import {Config} from 'common';
import {ActivityIndicator} from 'react-native-paper';
import {useQueryClient} from '@tanstack/react-query';
import {Button, Header, Input} from '../../../Components';
import {PageContainer} from '../../../Containers';
import {useLanguage, useMutation, useQuery, useShowToast, useTheme} from '../../../Hooks';
import {UserApi} from '../../../Api';
import {AuthActions, useAppDispatch} from '../../../Redux';
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

const EditProfile: React.FC<SettingsEditProfileScreenProps> = ({navigation}) => {
  const theme = useTheme();
  const language = useLanguage();
  const showToast = useShowToast();
  const dispatch = useAppDispatch();

  const styles = getStyles(theme);

  const queryClient = useQueryClient();

  const me = useQuery({
    queryKey: ['me'],
    queryFn: UserApi.getMe,
  });

  const mutation = useMutation({
    mutationFn: UserApi.edit,
  });

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

  const onFormSubmit = async (values: typeof initialValues) => {
    try {
      const newMe = await mutation.mutateAsync(values);

      queryClient.invalidateQueries({queryKey: ['user', newMe.username]});
      queryClient.invalidateQueries({queryKey: ['user', me.data?.username]});
      queryClient.invalidateQueries({queryKey: ['me']});
      queryClient.refetchQueries({queryKey: ['user', newMe.username]});

      dispatch(AuthActions.setUser(newMe));

      navigation.goBack();

      showToast({
        type: 'success',
        title: language.settings.profile_updated_title,
        message: language.settings.profile_updated_message,
      });
    } catch (error) {
      // Mutations handle errors automatically, so we don't need to do anything here.
    }
  };

  return (
    <PageContainer>
      <Header title={language.settings.edit_profile} />

      {me.isLoading || !me.data ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <Formik
            initialValues={{
              ...initialValues,
              username: me.data.username,
              fullname: me.data.fullname || initialValues.username,
              email: me.data.email,
              bio: me.data.bio || initialValues.username,
            }}
            validate={validateForm}
            onSubmit={onFormSubmit}
          >
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
      )}
    </PageContainer>
  );
};

export default EditProfile;
