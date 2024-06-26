import { chatAction } from '@grammyjs/auto-chat-action';
import { Composer } from 'grammy';
import type { Context } from '#root/bot/context.js';
import { isAdmin } from '#root/bot/filters/index.js';
import { setCommandsHandler } from '#root/bot/handlers/index.js';
import { logHandle } from '#root/bot/helpers/logging.js';
import { ADMIN_CONVERSATION } from '#root/bot/conversations/index.js';

const composer = new Composer<Context>();

const feature = composer.chatType('private').filter(isAdmin);

feature.command(
  'setcommands',
  logHandle('command-setcommands'),
  chatAction('typing'),
  setCommandsHandler,
);

feature.on('callback_query:data', logHandle('command-admin'), (ctx) => {
  return ctx.conversation.enter(ADMIN_CONVERSATION);
});

export { composer as adminFeature };
