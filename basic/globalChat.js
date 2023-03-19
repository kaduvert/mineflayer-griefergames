const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const globalChat = bot.ggData.globalChat
    bot.loadChatPatterns(globalChat)

    bot.globalChat = {
        events: new EventEmitter()
    }

    bot.globalChat.login = () => {
        return bot.chat.getChatActionResult(
            globalChat.commands.login,
            'chat:globalChatActivated',
            ['chat:globalChatAlreadyActivated'],
            5000
        )
    }

    bot.globalChat.logout = () => {
        return bot.chat.getChatActionResult(
            globalChat.commands.logout,
            'chat:globalChatDeativated',
            ['chat:globalChatAlreadyDeativated'],
            5000
        )
    }

    bot.globalChat.send = (message) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(globalChat.commands.send, message),
            'globalChatSentMessage',
            ['chat:globalChatDeactivatedError'],
            5000,
            bot.globalChat.events
        )
    }

    bot.on('chat:globalChatMessage', ([[cb, rank, username, message]]) => {
        if (username === bot.username) {
            bot.globalChat.events.emit('globalChatSentMessage', cb, rank, username, message)
        }
    })
}
