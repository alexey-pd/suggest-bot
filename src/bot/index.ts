import process from 'node:process';
import { autoChatAction } from '@grammyjs/auto-chat-action';
import { hydrate } from '@grammyjs/hydrate';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { conversations } from '@grammyjs/conversations';
import type { BotConfig, StorageAdapter } from 'grammy';
import { Bot as TelegramBot, session } from 'grammy';
import type {
  Context,
  SessionData,
} from '~/bot/context.js';
import {
  createContextConstructor,
} from '~/bot/context.js';
import {
  adminFeature,
  languageFeature,
  unhandledFeature,
  welcomeFeature,
} from '~/bot/features/index.js';
import { errorHandler } from '~/bot/handlers/index.js';
import { i18n, isMultipleLocales } from '~/bot/i18n.js';
import { updateLogger } from '~/bot/middlewares/index.js';
import { config } from '~/config.js';
import { logger } from '~/logger.js';
import { sendConversation } from '~/bot/conversations/index.js';
import { adminConversation } from '~/bot/conversations/admin.js';

interface Options {
  sessionStorage?: StorageAdapter<SessionData>
  config?: Omit<BotConfig<Context>, 'ContextConstructor'>
}

export function createBot(token: string, options: Options = {}) {
  const { sessionStorage } = options;
  const bot = new TelegramBot(token, {
    ...options.config,
    ContextConstructor: createContextConstructor({ logger }),
  });
  const protectedBot = bot.errorBoundary(errorHandler);
  const [adminId] = JSON.parse(`${process.env.BOT_ADMINS}`);
  const channelId = `${process.env.BOT_CHANNEL_ID}`;

  // Middlewares
  bot.api.config.use(parseMode('HTML'));

  if (config.isDev)
    protectedBot.use(updateLogger());

  protectedBot.use(autoChatAction(bot.api));
  protectedBot.use(hydrateReply);
  protectedBot.use(hydrate());
  protectedBot.use(
    session({
      initial: () => ({}),
      storage: sessionStorage,
    }),
  );
  protectedBot.use(i18n);
  protectedBot.use(conversations());
  protectedBot.use(sendConversation(adminId));
  protectedBot.use(adminConversation(channelId));

  // Handlers
  protectedBot.use(welcomeFeature);
  protectedBot.use(adminFeature);

  if (isMultipleLocales)
    protectedBot.use(languageFeature);

  // must be the last handler
  protectedBot.use(unhandledFeature);

  return bot;
}

export type Bot = ReturnType<typeof createBot>;
