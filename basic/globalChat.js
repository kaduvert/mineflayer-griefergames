const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const globalChat = bot.ggData.globalChat
    bot.chat.loadPatterns(globalChat)

    bot.globalChat = {
        events: new EventEmitter()
    }

    bot.globalChat.login = () => {
        return bot.chat.getChatActionResult(
            globalChat.commands.login,
            'activated',
            ['alreadyActivated'],
            5000
        )
    }

    bot.globalChat.logout = () => {
        return bot.chat.getChatActionResult(
            globalChat.commands.logout,
            'deativated',
            ['alreadyDeativated'],
            5000
        )
    }

    bot.globalChat.send = (message) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(globalChat.commands.send, message),
            'sentMessage',
            ['deactivatedError'],
            5000,
            bot.globalChat.events
        )
    }

    bot.on('chat:globalChat->message', ([[cb, rank, username, message]]) => {
        if (username === bot.username) {
            bot.globalChat.events.emit('sentMessage', cb, rank, username, message)
        }
    })
}
