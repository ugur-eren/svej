import {Notification as NotificationPlaceholder} from './Notification';

export const NotificationList: React.FC = () => {
  return Array.from({length: 15}).map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <NotificationPlaceholder key={index.toString()} />
  ));
};
