import {StyleSheet, View} from 'react-native';
import {Placeholder, PlaceholderMedia, PlaceholderLine, Fade} from 'rn-placeholder';
import {Spacing} from '../../Styles';

export const Profile: React.FC = () => {
  return (
    <Placeholder Animation={Fade}>
      <PlaceholderLine width={100} height={200} noMargin style={styles.cover} />

      <View style={styles.avatar}>
        <PlaceholderMedia isRound size={120} />

        <View style={styles.username}>
          <PlaceholderLine width={40} height={15} />
          <PlaceholderLine width={50} height={15} />
        </View>
      </View>

      <PlaceholderLine width={100} />

      <View style={styles.counts}>
        <View style={styles.count}>
          <PlaceholderLine width={50} />
          <PlaceholderLine width={30} />
        </View>
        <View style={styles.count}>
          <PlaceholderLine width={50} />
          <PlaceholderLine width={30} />
        </View>
        <View style={styles.count}>
          <PlaceholderLine width={50} />
          <PlaceholderLine width={30} />
        </View>
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  cover: {
    borderRadius: 0,
  },
  avatar: {
    flexDirection: 'row',
    gap: 12,
    top: -40,
    paddingLeft: Spacing.pagePadding,
  },
  username: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  counts: {
    flexDirection: 'row',
  },
  count: {
    flex: 1,
    alignItems: 'center',
  },
});
