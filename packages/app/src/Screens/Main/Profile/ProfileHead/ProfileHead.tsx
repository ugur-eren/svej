import {memo} from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {Avatar, Divider, Text, TextButton} from '../../../../Components';
import {useLanguage, useQuery, useTheme} from '../../../../Hooks';
import {UserApi} from '../../../../Api';
import {Selectors, useAppSelector} from '../../../../Redux';
import {ProfileScreenProps} from '../../../../Types';
import {GlobalStyles} from '../../../../Styles';
import getStyles from './ProfileHead.styles';

export type ProfileHeadProps = {
  username: string;
};

const ProfileHead: React.FC<ProfileHeadProps> = ({username}) => {
  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, username));

  const user = useQuery({
    queryFn: () => UserApi.getByUsername(username),
    queryKey: ['user', username],
  });

  const styles = getStyles(theme);

  const onPPPress = () => {
    navigation.navigate('ImageViewer', {
      title: username,
      image: user.data?.profilePhoto?.fileKey ?? '',
    });
  };

  const onBGPress = () => {
    navigation.navigate('ImageViewer', {
      title: username,
      image: user.data?.coverPhoto?.fileKey ?? '',
    });
  };

  const onFollowsPress = () => navigation.navigate('Relations', {type: 'follows'});
  const onFollowersPress = () => navigation.navigate('Relations', {type: 'followers'});

  // TODO: Add loading indicator
  if (!user.data) return null;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <TouchableWithoutFeedback
          style={GlobalStyles.flex1}
          onPress={user.data.coverPhoto?.fileKey ? onBGPress : undefined}
        >
          <View style={GlobalStyles.flex1}>
            <Image
              source={{uri: user.data.coverPhoto?.fileKey}}
              contentFit="cover"
              style={GlobalStyles.flex1}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.topInfoContainer}>
        <View style={styles.profilePhotoContainer}>
          <TouchableWithoutFeedback
            style={styles.profilePhotoContainer}
            onPress={user.data.profilePhoto?.fileKey ? onPPPress : undefined}
          >
            <Avatar avatar={user.data.profilePhoto?.fileKey} style={styles.profilePhoto} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.userInfo}>
          <Text weight="semiBold" fontSize={15}>
            {user.data.username}
          </Text>

          <Text>{user.data.fullname}</Text>
        </View>

        {!isSelf ? (
          <View style={styles.userActions}>
            <TextButton color="primary" showLoading containerProps={{style: {flex: undefined}}}>
              {language.common.follow}
            </TextButton>

            <TextButton color="primary" containerProps={{style: {flex: undefined}}}>
              {language.common.send_message}
            </TextButton>
          </View>
        ) : null}
      </View>

      {user.data.bio ? (
        <View style={styles.bio}>
          <Text>{user.data.bio}</Text>
        </View>
      ) : null}

      {user.data.tags.length > 0 ? (
        <View style={styles.userTagsContainer}>
          {user.data.tags.map((tag) => (
            <View key={tag.id} style={styles.userTag}>
              <Feather
                name={tag.icon as never}
                size={16}
                color={tag.color}
                style={styles.userTagIcon}
              />

              <Text>{tag.name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.centerContainer}>
        <View style={styles.postsCount}>
          <Text>{language.common.posts}</Text>

          <Text weight="semiBold" fontSize={16}>
            {user.data._count.posts}
          </Text>
        </View>

        <Divider direction="vertical" />

        <TouchableOpacity style={styles.centerTouchable} onPress={onFollowsPress}>
          <Text>{language.common.follows}</Text>

          <Text weight="semiBold" fontSize={16}>
            {user.data._count.follows}
          </Text>
        </TouchableOpacity>

        <Divider direction="vertical" />

        <TouchableOpacity style={styles.centerTouchable} onPress={onFollowersPress}>
          <Text>{language.common.followers}</Text>

          <Text weight="semiBold" fontSize={16}>
            {user.data._count.followers}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ProfileHead);
