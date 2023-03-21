const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const money = bot.ggData.money
    bot.chat.loadPatterns(money)

    bot.money = {}

    bot.money.transfer = (username, amount) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(money.transfer, username, amount),
            'transferred',
            ['insufficientError', 'playerOfflineError'],
            16000
        )
    }
}
