import process from 'node:process';
// @ts-expect-error debt
import type { Other } from 'grammy/out/core/api';
// @ts-expect-error debt
import type { RawApi } from 'grammy/out/core/client';
import type { Context } from '#root/bot/context.js';
import { InlineKeyboard } from 'grammy';

export async function sendPhoto(ctx: Context, fileId: string, other?: Other<RawApi, 'sendPhoto', 'chat_id' | 'photo'>) {
  const [adminId] = JSON.parse(`${process.env.BOT_ADMINS}`);

  const keyboard = new InlineKeyboard()
    .text("Approve", 'approve');

  const params = {
    ...other,
    reply_markup: keyboard,
  };

  await ctx.api.sendPhoto(
    adminId,
    fileId,
    params,
  );
}
