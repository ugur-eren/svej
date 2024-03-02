import {StyleSheet, View} from 'react-native';
import {Placeholder, Fade} from 'rn-placeholder';
import {PlaceholderLine, PlaceholderMedia} from '../Placeholder/Placeholder';
import {Spacing} from '../../Styles';

export const Post: React.FC = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={styles.avatar}>
        <PlaceholderMedia isRound size={60} />

        <View style={styles.username}>
          <PlaceholderLine width={40} height={15} />
          <PlaceholderLine width={50} height={15} noMargin />
        </View>
      </View>

      <PlaceholderLine width={100} height={300} noMargin style={styles.post} />

      <View style={styles.bottom}>
        <View style={styles.counts}>
          <PlaceholderMedia isRound size={40} />
          <PlaceholderMedia isRound size={40} />
        </View>

        <PlaceholderLine width={30} noMargin />
      </View>

      <View style={styles.comments}>
        <PlaceholderLine width={100} noMargin />
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: Spacing.pagePadding,
    marginVertical: Spacing.small,
  },
  username: {
    flex: 1,
    justifyContent: 'center',
  },
  post: {
    borderRadius: 0,
    marginBottom: Spacing.small,
  },
  bottom: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.pagePadding,
    alignItems: 'center',
  },
  counts: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.large,
  },
  comments: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.small,
  },
});
