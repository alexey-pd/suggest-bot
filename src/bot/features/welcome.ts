import { Composer } from 'grammy';
import type { Context } from '#root/bot/context.js';
import { logHandle } from '#root/bot/helpers/logging.js';
import { SEND_CONVERSATION } from '#root/bot/conversations/index.js';
import { sendMedia } from '#root/bot/features/send/send.js';

const composer = new Composer<Context>();

const feature = composer.chatType('private');

feature.command('start', logHandle('command-start'), (ctx) => {
  return ctx.conversation.enter(SEND_CONVERSATION);
});

feature.on('message:photo', async (ctx) => {
  const fileId = ctx.message.photo?.pop()?.file_id;
  if (fileId) {
    await sendMedia(ctx, fileId, 'photo');
  }
});

feature.on('message:animation', async (ctx) => {
  const fileId = ctx.message.animation.file_id;
  if (fileId) {
    await sendMedia(ctx, fileId, 'animation');
  }
});

feature.on('message:video', async (ctx) => {
  const fileId = ctx.message.video.file_id;
  if (fileId) {
    await sendMedia(ctx, fileId, 'video');
  }
});

feature.on('message:file', async (ctx) => {
  const fileId = ctx?.message?.document?.file_id;
  if (fileId) {
    await sendMedia(ctx, fileId, 'document');
  }
});

feature.command(SEND_CONVERSATION, logHandle('command-send'), (ctx) => {
  return ctx.conversation.enter(SEND_CONVERSATION);
});

export { composer as welcomeFeature };
