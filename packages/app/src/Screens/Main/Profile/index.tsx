import {useRef} from 'react';
import {List} from 'react-native-paper';
import {useQueryClient} from '@tanstack/react-query';
import {UsersApi} from '@/Api';
import {PageContainer, PostList} from '@/Containers';
import {ListItem, Modalize, TransparentHeader} from '@/Components';
import {useLanguage, useMutation, useShowDialog, useShowToast} from '@/Hooks';
import {Selectors, useAppSelector} from '@/Redux';
import {GlobalStyles} from '@/Styles';
import {parseLanguageParts} from '@/Utils/Helpers';
import {BottomProfileScreenProps, ProfileScreenProps} from '@/Types';
import ProfileHead from './ProfileHead';

const Profile: React.FC<ProfileScreenProps & BottomProfileScreenProps> = ({navigation, route}) => {
  const {hideBack} = route.params;
  let {userId, username} = route.params;

  const language = useLanguage();

  const modalizeRef = useRef<Modalize>(null);

  const showToast = useShowToast();
  const showDialog = useShowDialog();

  /**
   * If userId and username are not provided, use the current user's id and username
   */
  const user = useAppSelector(Selectors.Auth.User);
  if (!userId && !username) {
    userId = user?.id;
    username = user?.username;
  }

  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, username));

  const onSettingsPress = () => navigation.navigate('SettingsStack', {screen: 'Settings'});

  const onMorePress = () => {
    modalizeRef.current?.open();
  };

  const queryClient = useQueryClient();

  const block = useMutation({
    mutationKey: ['block'],
    mutationFn: UsersApi.block,
  });

  const showBlockDialog = () => {
    showDialog({
      title: parseLanguageParts(language.profile.block_dialog_title, {username}),
      message: language.profile.block_dialog_message,
      actions: [
        {
          label: language.profile.block,
          type: 'destructive',
          hideOnPress: true,
          onPress: async () => {
            await block.mutateAsync(userId, {
              onSuccess: () => {
                modalizeRef.current?.close();

                showToast({
                  title: language.profile.block_success_title,
                  message: language.profile.block_success_message,
                  type: 'success',
                });

                queryClient.invalidateQueries({
                  queryKey: ['user', username],
                });
                queryClient.invalidateQueries({
                  queryKey: ['posts', 'profile', userId],
                });
              },
            });
          },
        },
        {
          label: language.common.cancel,
          hideOnPress: true,
          type: 'cancel',
        },
      ],
    });
  };

  return (
    <PageContainer>
      <PostList
        type="profile"
        userId={userId}
        style={GlobalStyles.flex1}
        ListHeaderComponent={<ProfileHead userId={userId} username={username} />}
      />

      <TransparentHeader
        title={username}
        onSettingsPress={isSelf ? onSettingsPress : undefined}
        onMorePress={isSelf ? undefined : onMorePress}
        hideBack={hideBack}
      />

      <Modalize ref={modalizeRef}>
        <List.Section>
          <ListItem title={language.profile.block} onPress={showBlockDialog} icon="slash" />

          <ListItem title="Report" onPress={() => {}} icon="alert-circle" />
        </List.Section>
      </Modalize>
    </PageContainer>
  );
};

export default Profile;
