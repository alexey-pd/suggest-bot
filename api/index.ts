import { handle } from '@hono/node-server/vercel';
import { createBot } from '~/bot/index.js';
import { config as configuration } from '~/config.js';
import { createServer } from '~/server/index.js';

const bot = createBot(configuration.BOT_TOKEN);
const server = await createServer(bot);

export default handle(server);
