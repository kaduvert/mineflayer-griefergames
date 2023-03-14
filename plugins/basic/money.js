const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\$(\d+) wurden zu deinem Konto hinzugefügt\.$/, 'moneyCredited')
    bot.chatAddPattern(/^Du hast \S+ ┃ (\S+) \$([\d,\.]+) gegeben\.$/, 'moneyTransferred')
    bot.chatAddPattern(/^\S+ ┃ (\S+) hat dir \$([\d,\.]+) gegeben\.$/, 'moneyReceived')

    bot.chatAddPattern(/^Fehler: Du hast nicht genug Guthaben\.$/, 'moneyInsufficientError')
    bot.chatAddPattern(/^\[GrieferGames\] Dieser Spieler wurde nicht gefunden\.$/, 'moneyPlayerOfflineError')

	bot.money = {}

    bot.money.transfer = (username, amount) => {
        return bot.chat.getChatActionResult(`/pay ${username} ${amount}`, 'moneyTransferred', ['moneyInsufficientError', 'moneyPlayerOfflineError'], 16000)
    }
}
