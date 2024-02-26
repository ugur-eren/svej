import type {PrismaTypes, PrismaIncludes} from 'database';

export type Notification = PrismaTypes.NotificationGetPayload<{
  include: ReturnType<typeof PrismaIncludes.Notification>;
}>;
