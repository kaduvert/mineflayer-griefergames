const chalk = require('chalk')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.registry)

    bot.gg.chat.unread = []

    bot.gg.chat.getUnread = () => {
        const unreadMessages = bot.gg.chat.unread

        bot.gg.chat.unread = []

        return unreadMessages
    }

    bot.gg.chat.getUnreadFormatted = () => bot.gg.chat.getUnread().map(({ ts, msg }) => (chalk.cyan(`[${ts.toLocaleTimeString('de')}] `) + msg)).join('\n')

    bot.on('message', (msg, pos) => {
        if (!bot.noLog && (pos !== 'game_info')) {
            const str = msg.toString()
		    if (str === '»' || str === '') return

            bot.gg.chat.unread.push({ ts: (new Date()), msg: msg.toAnsi() })
        }
    })

    bot.on('kicked', (reason) => (
        console.log(
            chalk.red(`[${(new Date()).toLocaleTimeString('de')}]`),
            chalk.yellowBright('Kicked:'),
            (new ChatMessage(JSON.parse(reason))).toAnsi()
        )
    ))
}
