import {ProfileWidget as ProfileWidgetPlaceholder} from './ProfileWidget';

export const ProfileWidgetList: React.FC = () => {
  return Array.from({length: 15}).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <ProfileWidgetPlaceholder key={index.toString()} />
  ));
};
