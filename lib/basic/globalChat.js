const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const globalChat = bot.loadPatternsAndGetData('globalChat')

    bot.globalChat = {
        events: new EventEmitter()
    }

    bot.globalChat.login = () => {
        return bot.chat.sendFallible({
            patternHead: 'globalChat',
            command: 'login',
            successEvent: 'activated',
            failureEvent: 'alreadyActivated',
            timeout: 5000
        })
    }

    bot.globalChat.logout = () => {
        return bot.chat.sendFallible({
            patternHead: 'globalChat',
            command: 'logout',
            successEvent: 'deativated',
            failureEvent: 'alreadyDeativated',
            timeout: 5000
        })
    }

    bot.globalChat.send = (message) => {
        return bot.chat.sendFallible({
            patternHead: 'globalChat',
            command: ['send', message],
            successEvent: 'sentMessage',
            failureEvent: 'deactivatedError',
            timeout: 5000,
            successEventEmitter: bot.globalChat.events
        })
    }

    bot.on('chat:globalChat->message', ([[cb, rank, username, message]]) => {
        if (username === bot.username) {
            bot.globalChat.events.emit('sentMessage', cb, rank, username, message)
        }
    })
}
