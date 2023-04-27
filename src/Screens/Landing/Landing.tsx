import {Text} from '../../Components';
import {PageContainer} from '../../Containers';
import {useLanguage} from '../../Hooks';
import {OnboardingLandingScreenProps} from '../../Typings/NavigationTypes';

type Props = OnboardingLandingScreenProps;

const Landing: React.FC<Props> = () => {
  const language = useLanguage();

  return (
    <PageContainer withSafeArea withPadding>
      <Text fontSize={18}>{language.routes.landing.hello}</Text>
    </PageContainer>
  );
};

export default Landing;
