import { InlineKeyboard } from 'grammy';
// @ts-expect-error debt
import type { Other } from 'grammy/out/core/api';
// @ts-expect-error debt
import type { RawApi } from 'grammy/out/core/client';
import type { Context } from '#root/bot/context.js';
import { config } from '#root/config.js';

export async function sendPhoto(ctx: Context, fileId: string, other?: Other<RawApi, 'sendPhoto', 'chat_id' | 'photo'>) {
  const keyboard = new InlineKeyboard()
    .text('Approve', 'approve');

  const [adminId] = config.BOT_ADMINS;

  const params = {
    ...other,
    reply_markup: keyboard,
    caption: `@${ctx.from?.username || ctx.from?.first_name}`,
  };

  await ctx.reply(`Thanks for the photo!`);

  const photo = await ctx.api.sendPhoto(
    adminId,
    fileId,
    params,
  );

  await ctx.api.pinChatMessage(adminId, photo.message_id);
}
