const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const money = bot.loadPatternsAndGetData('money')

    bot.money = {}

    bot.money.transfer = (username, amount) => {
        return bot.chat.getChatActionResult(
            'money',
            ['transfer', username, amount],
            'transferred',
            ['insufficientError', 'playerOfflineError'],
            16000
        )
    }
}
