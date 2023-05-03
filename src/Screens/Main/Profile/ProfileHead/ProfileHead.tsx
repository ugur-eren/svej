import {View, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper';
import {Image} from 'expo-image';
import {Text, TextButton, TransparentHeader} from '../../../../Components';
import {useTheme} from '../../../../Hooks';
import {GlobalStyles} from '../../../../Styles';
import getStyles from './ProfileHead.styles';

const ProfileHead: React.FC = () => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        {/* TODO: navigate to image viewer on press */}
        <TouchableWithoutFeedback style={GlobalStyles.flex1}>
          <View style={GlobalStyles.flex1}>
            <Image
              source={{uri: `https://unsplash.it/900/600/?random=${Math.random()}`}}
              contentFit="cover"
              style={GlobalStyles.flex1}
            />
          </View>
        </TouchableWithoutFeedback>

        <TransparentHeader title="ugur-eren" />
      </View>

      <View style={styles.topInfoContainer}>
        <View style={styles.profilePhotoContainer}>
          {/* TODO: navigate to image viewer on press */}
          <TouchableWithoutFeedback style={styles.profilePhotoContainer}>
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
            Follow
          </TextButton>

          <TextButton color="primary" containerProps={{style: {flex: undefined}}}>
            Send Message
          </TextButton>
        </View>
      </View>

      <View style={styles.bio}>
        <Text>Esse labore cillum labore Lorem dolor quis voluptate proident.</Text>
      </View>

      {/* TODO: user tags */}

      <View style={[styles.centerContainer, {}]}>
        <View style={styles.postsCount}>
          <Text>Posts</Text>

          <Text weight="semiBold" fontSize={16}>
            4
          </Text>
        </View>

        <Divider style={styles.centerDivider} />

        <TouchableOpacity style={styles.centerTouchable}>
          <Text>Follows</Text>

          <Text weight="semiBold" fontSize={16}>
            39
          </Text>
        </TouchableOpacity>

        <Divider style={styles.centerDivider} />

        <TouchableOpacity style={styles.centerTouchable}>
          <Text>Followers</Text>

          <Text weight="semiBold" fontSize={16}>
            126
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHead;
