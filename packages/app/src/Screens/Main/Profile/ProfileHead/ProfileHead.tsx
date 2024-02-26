import {Config} from 'common';
import {memo, useState} from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {IconButton} from 'react-native-paper';
import {useQueryClient} from '@tanstack/react-query';
import {Avatar, Divider, Text, TextButton} from '../../../../Components';
import {
  useLanguage,
  useMutation,
  useQuery,
  useShowApiError,
  useShowToast,
  useTheme,
} from '../../../../Hooks';
import {UserApi, FileApi} from '../../../../Api';
import {Selectors, useAppSelector} from '../../../../Redux';
import {ProfileScreenProps} from '../../../../Types';
import {GlobalStyles} from '../../../../Styles';
import getStyles from './ProfileHead.styles';

export type ProfileHeadProps = {
  userId: string;
  username: string;
};

const ProfileHead: React.FC<ProfileHeadProps> = ({userId, username}) => {
  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<ProfileScreenProps['navigation']>();
  const showToast = useShowToast();
  const showApiError = useShowApiError();

  const isSelf = useAppSelector((state) => Selectors.Auth.UserIsSelf(state, username));

  const [profilePhotoLoading, setProfilePhotoLoading] = useState(false);
  const [coverPhotoLoading, setCoverPhotoLoading] = useState(false);

  const queryClient = useQueryClient();

  const user = useQuery({
    queryFn: () => UserApi.getByUsername(username),
    queryKey: ['user', username],
  });

  const relation = useMutation({
    mutationKey: ['relation', userId],
    mutationFn: (type: 'follow' | 'unfollow') => UserApi.updateRelation(userId, type),
  });

  const styles = getStyles(theme);

  const onPPPress = () => {
    navigation.navigate('ImageViewer', {
      title: username,
      image: FileApi.getFileURL(user.data?.profilePhoto?.fileKey),
    });
  };

  const onBGPress = () => {
    navigation.navigate('ImageViewer', {
      title: username,
      image: FileApi.getFileURL(user.data?.coverPhoto?.fileKey),
    });
  };

  const onFollowsPress = () => {
    navigation.push('Relations', {type: 'follows', userId, username});
  };
  const onFollowersPress = () => {
    navigation.push('Relations', {type: 'followers', userId, username});
  };

  const changePhoto = async (type: 'profile' | 'cover') => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [
        ...(type === 'profile' ? Config.profilePhotoAspectRatio : Config.coverPhotoAspectRatio),
      ],
      allowsEditing: true,
      allowsMultipleSelection: false,
      selectionLimit: 1,
      exif: false,
      quality: 0.75,
    });

    if (pickerResult.canceled || !pickerResult.assets.length) return;
    const file = pickerResult.assets[0];

    try {
      const result = await UserApi.changePhoto(type, file, {timeout: 0});
      if (!result.ok) throw result.data;

      queryClient.invalidateQueries({
        queryKey: ['user', username],
      });

      showToast({
        type: 'success',
        title: {
          profile: language.profile.profile_photo_changed_title,
          cover: language.profile.cover_photo_changed_title,
        }[type],
        message: {
          profile: language.profile.profile_photo_changed_message,
          cover: language.profile.cover_photo_changed_message,
        }[type],
      });
    } catch (error) {
      showApiError(error as Error);
    }
  };

  const onProfilePhotoCameraPress = async () => {
    setProfilePhotoLoading(true);
    await changePhoto('profile');
    setProfilePhotoLoading(false);
  };

  const onCoverPhotoCameraPress = async () => {
    setCoverPhotoLoading(true);
    await changePhoto('cover');
    setCoverPhotoLoading(false);
  };

  const onUpdateRelationPress = async () => {
    if (!user.data) return;

    try {
      await relation.mutateAsync(user.data.isFollowing ? 'unfollow' : 'follow', {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['user', username],
          });
        },
      });
    } catch (error) {
      //
    }
  };

  // TODO: Add loading indicator
  if (!user.data) return null;

  return (
    <View style={styles.container}>
      <View style={styles.coverPhotoContainer}>
        <TouchableWithoutFeedback
          style={GlobalStyles.flex1}
          onPress={user.data.coverPhoto?.fileKey ? onBGPress : undefined}
        >
          <View style={GlobalStyles.flex1}>
            <Image
              source={{uri: FileApi.getFileURL(user.data.coverPhoto?.fileKey)}}
              contentFit="cover"
              style={GlobalStyles.flex1}
            />

            {isSelf ? (
              <IconButton
                icon={coverPhotoLoading ? 'loader' : 'camera'}
                style={styles.coverPhotoCamera}
                onPress={coverPhotoLoading ? undefined : onCoverPhotoCameraPress}
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.topInfoContainer}>
        <View style={styles.profilePhotoContainer}>
          <View style={styles.profilePhotoContent}>
            <TouchableWithoutFeedback
              onPress={user.data.profilePhoto?.fileKey ? onPPPress : undefined}
            >
              <Avatar avatarKey={user.data.profilePhoto?.fileKey} style={styles.profilePhoto} />
            </TouchableWithoutFeedback>
          </View>

          {isSelf ? (
            <IconButton
              icon={profilePhotoLoading ? 'loader' : 'camera'}
              style={styles.profilePhotoCamera}
              onPress={profilePhotoLoading ? undefined : onProfilePhotoCameraPress}
            />
          ) : null}
        </View>

        <View style={styles.userInfo}>
          <Text weight="semiBold" fontSize={15}>
            {user.data.username}
          </Text>

          <Text>{user.data.fullname}</Text>
        </View>

        {!isSelf ? (
          <View style={styles.userActions}>
            <TextButton color="primary" showLoading onPress={onUpdateRelationPress}>
              {user.data.isFollowing ? language.common.unfollow : language.common.follow}
            </TextButton>

            <TextButton color="primary">{language.common.send_message}</TextButton>
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
