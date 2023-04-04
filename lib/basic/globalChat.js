const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const globalChat = bot.loadPatternsAndGetData('globalChat')

    bot.globalChat = {
        events: new EventEmitter()
    }

    bot.on('chat:globalChat->message', ([[cb, rank, username, message]]) => {
        if (username === bot.username) {
            bot.globalChat.events.emit('sentMessage', cb, rank, username, message)
        }
    })
}
