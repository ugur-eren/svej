import {ScrollView} from 'react-native';
import {useTheme} from '../../Hooks';
import getStyles from './styles';

export type AuthPageContainerProps = {
  children?: React.ReactNode;
};

const Container: React.FC<AuthPageContainerProps> = ({children}) => {
  const theme = useTheme();

  const styles = getStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};

export default Container;
