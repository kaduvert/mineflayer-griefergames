const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^@\[(\S+)\] (\S+) ┃ (\S+) » (.*)$/, 'globalChatMessage')
    bot.chatAddPattern(/^\[GlobalChat\] Du kannst nicht im Global-Chat schreiben, da du ihn deaktiviert hast\.$/, 'globalChatDeactivatedError')

    bot.chatAddPattern(/^\[GlobalChat\] Du hast den Global-Chat aktiviert\.$/, 'globalChatActivated')
    bot.chatAddPattern(/^\[GlobalChat\] Du hast den Global-Chat deaktiviert\.$/, 'globalChatDeativated')

    bot.chatAddPattern(/^\[GlobalChat\] Der Global-Chat ist bereits aktiviert\.$/, 'globalChatAlreadyActivated')
    bot.chatAddPattern(/^\[GlobalChat\] Der Global-Chat ist bereits deaktiviert\.$/, 'globalChatAlreadyDeativated')

    bot.chatAddPattern(/^\[GlobalChat\] Du hast den Server (.+) gemutet\.$/, 'globalChatServerMuted')
    bot.chatAddPattern(/^\[GlobalChat\] Du hast den Server (.+) entmutet\.$/, 'globalChatServerMuted')

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






