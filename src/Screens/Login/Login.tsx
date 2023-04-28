import {Text} from '../../Components';
import {PageContainer} from '../../Containers';
import {useLanguage} from '../../Hooks';
import {AuthLoginScreenProps} from '../../Typings/NavigationTypes';

type Props = AuthLoginScreenProps;

const Login: React.FC<Props> = () => {
  const language = useLanguage();

  return (
    <PageContainer withSafeArea withPadding>
      <Text fontSize={18}>{language.routes.login.hello}</Text>
    </PageContainer>
  );
};

export default Login;
