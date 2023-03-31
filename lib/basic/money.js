const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const money = bot.loadPatternsAndGetData('money')

    bot.money = {}

    bot.money.transfer = (username, amount) => {
        return bot.chat.sendFallible({
            patternHead: 'money',
            command: ['transfer', username, amount],
            successEvent: 'transferred',
            failureEvents: ['insufficientError', 'playerOfflineError'],
            timeout: 16000
        })
    }
}
