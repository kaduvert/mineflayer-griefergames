// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const status = bot.loadPatternsAndGetData('status')

    bot.status = {}

    bot.status.set = (message) => {
        return bot.chat.sendFallible({
            patternHead: 'status',
            command: ['set', message],
            successEvent: 'set',
            failureEvent: 'insufficientPermissionsError',
            timeout: 5000
        })
    }

    bot.status.toggle = () => {
        return bot.chat.sendFallible({
            patternHead: 'status',
            command: 'toggle',
            successEvents: ['activated', 'deactivated'],
            failureEvent: 'insufficientPermissionsError',
            timeout: 5000
        })
    }
}