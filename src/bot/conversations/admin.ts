import type { Conversation } from '@grammyjs/conversations';
import { createConversation } from '@grammyjs/conversations';
import type { Context } from '#root/bot/context.js';

export const ADMIN_CONVERSATION = 'approve';

export function adminConversation(channelId: string) {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      const animation = ctx.callbackQuery?.message?.animation?.file_id;
      const photo = ctx.callbackQuery?.message?.photo?.pop()?.file_id;
      const media = photo || animation;

      if (animation) await ctx.api.sendAnimation(channelId, animation);
      if (photo) await ctx.api.sendPhoto(channelId, photo);

      if (media) {
        await ctx.api.unpinChatMessage(`${ctx.chat?.id}`);
        await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } });
      }
    },
    ADMIN_CONVERSATION,
  );
}
