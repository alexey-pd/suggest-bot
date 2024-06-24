import type { Conversation } from '@grammyjs/conversations';
import { createConversation } from '@grammyjs/conversations';
import type { Context } from '~/bot/context.js';

export const SEND_CONVERSATION = 'send';

export function sendConversation(adminId: string) {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      const replyMsg = 'Please send me the photo!';

      await ctx.reply(replyMsg);

      const photoMessage = await conversation.waitFor('message:photo');
      const fileId = photoMessage.message.photo?.pop()?.file_id;

      if (fileId) {
        await ctx.reply(`Thanks for the photo!`);

        await conversation.external(() => ctx.api.sendPhoto(
          adminId,
          fileId,
          { caption: `@${ctx.from?.username || ctx.from?.first_name} /approve` },
        ));

        await conversation.external(() => ctx.api.sendMessage(
          adminId,
          fileId,
        ));

        await conversation.external(() => ctx.api.sendMessage(
          adminId,
          '--',
        ));
      }
      else {
        await ctx.reply(replyMsg);
      }
    },
    SEND_CONVERSATION,
  );
}
