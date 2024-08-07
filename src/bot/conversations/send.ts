import type { Conversation } from '@grammyjs/conversations';
import { createConversation } from '@grammyjs/conversations';
import type { Context } from '#root/bot/context.js';
import { sendMedia } from '#root/bot/features/send/send.js';

export const SEND_CONVERSATION = 'send';

export function sendConversation() {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      const replyMsg = 'Please send me the photo, gif or video!';

      await ctx.reply(replyMsg);

      const photoMessage = await conversation.waitFor('message:photo');
      const fileId = photoMessage.message.photo?.pop()?.file_id;

      if (fileId) {
        await sendMedia(ctx, fileId, 'photo');
      }
    },
    SEND_CONVERSATION,
  );
}
