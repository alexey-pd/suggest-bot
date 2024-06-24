import { Composer } from 'grammy';
import type { Context } from '#root/bot/context.js';
import { logHandle } from '#root/bot/helpers/logging.js';
import { SEND_CONVERSATION } from '#root/bot/conversations/index.js';

const composer = new Composer<Context>();

const feature = composer.chatType('private');

feature.command('start', logHandle('command-start'), (ctx) => {
  return ctx.reply('welcome! /send');
});

feature.command(SEND_CONVERSATION, logHandle('command-send'), (ctx) => {
  return ctx.conversation.enter(SEND_CONVERSATION);
});

export { composer as welcomeFeature };
