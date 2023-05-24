import {useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {BottomShareInitScreenProps} from '../../../Types';

const ShareInit: React.FC<BottomShareInitScreenProps> = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      // Navigate to Share screen when this screen is focused
      navigation.navigate('MainStack', {screen: 'Share'});

      return () => {
        // Navigate back immediately so that the user doesn't see this screen
        navigation.goBack();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return null;
};

export default ShareInit;
