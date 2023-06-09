import {memo} from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {Divider, Text, TextButton} from '../../../../Components';
import {useLanguage, useTheme} from '../../../../Hooks';
import {ProfileScreenProps} from '../../../../Types';
import {GlobalStyles} from '../../../../Styles';
import getStyles from './ProfileHead.styles';

const ProfileHead: React.FC = () => {
  const theme = useTheme();
  const language = useLanguage();
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  const styles = getStyles(theme);

  const onPPPress = () => {
    navigation.navigate('ImageViewer', {
      title: 'ugur-eren',
      image: `https://unsplash.it/600/600/?random=${Math.random()}`,
    });
  };

  const onBGPress = () => {
    navigation.navigate('ImageViewer', {
      title: 'ugur-eren',
      image: `https://unsplash.it/900/600/?random=${Math.random()}`,
    });
  };

  const onFollowsPress = () => navigation.navigate('Relations', {type: 'follows'});
  const onFollowersPress = () => navigation.navigate('Relations', {type: 'followers'});

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <TouchableWithoutFeedback style={GlobalStyles.flex1} onPress={onBGPress}>
          <View style={GlobalStyles.flex1}>
            <Image
              source={{uri: `https://unsplash.it/900/600/?random=${Math.random()}`}}
              contentFit="cover"
              style={GlobalStyles.flex1}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.topInfoContainer}>
        <View style={styles.profilePhotoContainer}>
          {/* TODO: navigate to image viewer on press */}
          <TouchableWithoutFeedback style={styles.profilePhotoContainer} onPress={onPPPress}>
            <Image
              source={{uri: `https://unsplash.it/600/600/?random=${Math.random()}`}}
              style={styles.profilePhoto}
            />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.userInfo}>
          <Text weight="semiBold" fontSize={15}>
            ugur-eren
          </Text>

          <Text>Uğur Eren</Text>
        </View>

        <View style={styles.userActions}>
          <TextButton color="primary" showLoading containerProps={{style: {flex: undefined}}}>
            {language.common.follow}
          </TextButton>

          <TextButton color="primary" containerProps={{style: {flex: undefined}}}>
            {language.common.send_message}
          </TextButton>
        </View>
      </View>

      <View style={styles.bio}>
        <Text>Esse labore cillum labore Lorem dolor quis voluptate proident.</Text>
      </View>

      <View style={styles.userTagsContainer}>
        <View style={styles.userTag}>
          <Feather name="code" size={16} color={theme.colors.primary} style={styles.userTagIcon} />
          <Text>Developer</Text>
        </View>
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.postsCount}>
          <Text>{language.common.posts}</Text>

          <Text weight="semiBold" fontSize={16}>
            4
          </Text>
        </View>

        <Divider direction="vertical" />

        <TouchableOpacity style={styles.centerTouchable} onPress={onFollowsPress}>
          <Text>{language.common.follows}</Text>

          <Text weight="semiBold" fontSize={16}>
            39
          </Text>
        </TouchableOpacity>

        <Divider direction="vertical" />

        <TouchableOpacity style={styles.centerTouchable} onPress={onFollowersPress}>
          <Text>{language.common.followers}</Text>

          <Text weight="semiBold" fontSize={16}>
            126
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ProfileHead);
