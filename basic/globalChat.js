const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.globalChat)

    bot.globalChat = {
        events: new EventEmitter()
    }

    bot.globalChat.login = () => {
        return bot.chat.getChatActionResult('/globalchat login', 'globalChatActivated', ['globalChatAlreadyActivated'], 5000)
    }

    bot.globalChat.logout = () => {
        return bot.chat.getChatActionResult('/globalchat logout', 'globalChatDeativated', ['globalChatAlreadyDeativated'], 5000)
    }

    bot.globalChat.send = (message) => {
        return bot.chat.getChatActionResult(`@${message}`, 'globalChatSentMessage', ['globalChatDeactivatedError'], 5000, bot.globalChat.events)
    }

    bot.on('globalChatMessage', (cb, rank, username, message) => {
        if (username === bot.username) {
            bot.globalChat.events.emit('globalChatSentMessage', cb, rank, username, message)
        }
    })
}
