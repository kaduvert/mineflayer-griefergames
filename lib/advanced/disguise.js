// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const disguise = bot.loadPatternsAndGetData('disguise')

    bot.disguise = {
        current: null
    }

    bot.disguise.as = (disguiseIdentifier) => {
        return bot.chat.sendFallible({
            patternHead: 'disguise',
            command: ['as', disguiseIdentifier],
            successEvent: 'disguised',
            failureEvents: ['unknownArgumentsError', 'insufficientPermissionsError', 'pluginForbidsActionError'],
            timeout: 5000
        })
    }

    bot.disguise.remove = () => {
        return bot.chat.sendFallible({
            patternHead: 'disguise',
            command: 'remove',
            successEvent: 'removed',
            failureEvent: 'notFound',
            timeout: 5000
        })
    }

    bot.disguise.getStatus = () => {
        return bot.chat.sendFallible({
            patternHead: 'disguise',
            command: 'getStatus',
            successEvents: ['status', 'notFound'],
            timeout: 5000
        })
    }

    bot.on('chat:disguise->disguised', ([[disguiseIdentifier]]) => {
        bot.disguise.current = disguiseIdentifier
    })
}
