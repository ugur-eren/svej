import {StyleSheet, View} from 'react-native';
import {Placeholder, PlaceholderMedia, PlaceholderLine, Fade} from 'rn-placeholder';
import {Spacing} from '../../Styles';

export const ProfileWidget: React.FC = () => {
  return (
    <Placeholder Animation={Fade}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <PlaceholderMedia isRound size={60} />

          <View style={styles.username}>
            <PlaceholderLine width={50} height={10} />
            <PlaceholderLine width={60} height={10} noMargin />
          </View>

          <View style={styles.action}>
            <PlaceholderLine width={100} noMargin />
          </View>
        </View>
      </View>
    </Placeholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.pagePadding,
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: Spacing.small,
  },
  username: {
    flex: 1,
    justifyContent: 'center',
  },
  action: {
    width: '20%',
  },
});
