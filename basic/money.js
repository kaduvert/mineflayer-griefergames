const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.money)

	bot.money = {}

    bot.money.transfer = (username, amount) => {
        return bot.chat.getChatActionResult(`/pay ${username} ${amount}`, 'moneyTransferred', ['moneyInsufficientError', 'moneyPlayerOfflineError'], 16000)
    }
}
