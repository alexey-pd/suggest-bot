import type { Conversation } from '@grammyjs/conversations'
import { createConversation } from '@grammyjs/conversations'
import type { Context } from '#root/bot/context.js'
import { i18n } from '#root/bot/i18n.js'

export const SEND_CONVERSATION = 'send'

export function sendConversation(adminId: string) {
  return createConversation(
    async (conversation: Conversation<Context>, ctx: Context) => {
      await conversation.run(i18n)

      const replyMsg = 'Please send me the photo!';

      await ctx.reply(replyMsg)

      while (true) {
        ctx = await conversation.wait()

        if (ctx.hasCommand('cancel')) {
          return ctx.reply('Cancelled')
        }
        else if (ctx.has('message:photo')) {
          const fileId = ctx.message?.photo?.pop()?.file_id
          if (fileId) {
            await ctx.reply(`Thanks for the photo!`)
            await ctx.api.sendPhoto(adminId, fileId, { caption: `@${ctx.message?.from.username}` })
          }
        }
        else {
          await ctx.reply(replyMsg)
        }
      }
    },
    SEND_CONVERSATION,
  )
}
