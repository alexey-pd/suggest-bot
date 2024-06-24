import { chatAction } from '@grammyjs/auto-chat-action';
import { Composer } from 'grammy';
import type { Context } from '~/bot/context.js';
import { isAdmin } from '~/bot/filters/index.js';
import { setCommandsHandler } from '~/bot/handlers/index.js';
import { logHandle } from '~/bot/helpers/logging.js';
import { ADMIN_CONVERSATION } from '~/bot/conversations/index.js';

const composer = new Composer<Context>();

const feature = composer.chatType('private').filter(isAdmin);

feature.command(
  'setcommands',
  logHandle('command-setcommands'),
  chatAction('typing'),
  setCommandsHandler,
);

feature.command(ADMIN_CONVERSATION, logHandle('command-admin'), (ctx) => {
  return ctx.conversation.enter(ADMIN_CONVERSATION);
});

export { composer as adminFeature };
