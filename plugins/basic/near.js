// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^Spieler in der Nähe: (.+)$/, 'nearPlayersList')

	bot.near = {}

    bot.near.getPlayers = (distance = 200) => {
        return bot.chat.getChatActionResult(`/near ${distance}`, 'nearPlayersList', [], 5000)
    }
}

