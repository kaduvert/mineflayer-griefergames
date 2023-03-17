const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const money = bot.ggData.money
    bot.loadChatPatterns(money)

	bot.money = {}

    bot.money.transfer = (username, amount) => {
        return bot.chat.getChatActionResult(money.transfer(username, amount), 'moneyTransferred', ['moneyInsufficientError', 'moneyPlayerOfflineError'], 16000)
    }
}
