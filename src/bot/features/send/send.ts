import { InlineKeyboard } from 'grammy';
import type { Context } from '#root/bot/context.js';
import { config } from '#root/config.js';

type ContentType = 'photo' | 'video' | 'document' | 'animation';

export async function sendMedia(ctx: Context, fileId: string, contentType: ContentType) {
  const keyboard = new InlineKeyboard()
    .text('Approve', 'approve');

  const [adminId] = config.BOT_ADMINS;

  const params = {
    reply_markup: keyboard,
    caption: `@${ctx.from?.username || ctx.from?.first_name}`,
  };

  await ctx.reply(`Thanks for content!`);

  const media = {
    animation: () => ctx.api.sendAnimation(adminId, fileId, params),
    photo: () => ctx.api.sendPhoto(adminId, fileId, params),
    video: () => ctx.api.sendVideo(adminId, fileId, params),
    document: () => ctx.api.sendDocument(adminId, fileId, params),
  };

  const result = await media[contentType as ContentType]();

  await ctx.api.pinChatMessage(adminId, result.message_id);
}
