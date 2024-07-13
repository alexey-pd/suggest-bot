import type { Conversation } from '@grammyjs/conversations';
import { createConversation } from '@grammyjs/conversations';
import type { Context } from '#root/bot/context.js';

export const ADMIN_CONVERSATION = 'approve';

export function adminConversation(channelId: string) {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      const fileId = ctx.callbackQuery?.message?.photo?.pop()?.file_id;

      if (fileId) {
        await ctx.api.sendPhoto(channelId, fileId);
        await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } });
      }
    },
    ADMIN_CONVERSATION,
  );
}
