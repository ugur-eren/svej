import type {PrismaTypes, PrismaIncludes} from '@svej/database';

export type Notification = PrismaTypes.NotificationGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Notification>;
}>;

export type CountResponse = {
  count: number;
};
