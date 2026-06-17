import {Elysia} from 'elysia';
import {z} from 'zod';
import {onlyAuthenticated} from '@/Plugins';
import {ChatsModule} from '@/Modules/Chats';

export default new Elysia()
  .use(onlyAuthenticated)
  .get('/', async ({session}) => {
    return ChatsModule.getAllConversations(session.user.id);
  })
  .post(
    '/',
    async ({session, body: {participantId}}) => {
      return ChatsModule.getOrCreateConversationByParticipant(session.user.id, participantId);
    },
    {
      body: z.object({
        participantId: z.uuid(),
      }),
    },
  )
  .group('/:conversationId', {params: z.object({conversationId: z.uuid()})}, (app) =>
    app
      .get('/', async ({session, params: {conversationId}}) => {
        return ChatsModule.getConversationById(session.user.id, conversationId);
      })
      .get('/messages', async ({session, params: {conversationId}}) => {
        return ChatsModule.getConversationMessages(session.user.id, conversationId);
      }),
  )
  .get(
    '/by-participant/:participantId',
    async ({session, params: {participantId}}) => {
      return ChatsModule.getConversationByParticipant(session.user.id, participantId);
    },
    {
      params: z.object({
        participantId: z.uuid(),
      }),
    },
  );
