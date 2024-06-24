import type { Conversation } from '@grammyjs/conversations';
import { createConversation } from '@grammyjs/conversations';
import type { Context } from '~/bot/context.js';

export const ADMIN_CONVERSATION = 'approve';

export function adminConversation(channelId: string) {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await ctx.reply('Send photo id');
      const { message } = await conversation.waitFor('message:text');
      const fileId = message.text;

      if (fileId) {
        await ctx.api.sendPhoto(channelId, fileId);
      }
    },
    ADMIN_CONVERSATION,
  );
}
