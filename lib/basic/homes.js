// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const homes = bot.loadPatternsAndGetData('homes')
    // tpFailure
    // tpSpamWarning

    bot.homes = {}

    bot.homes.getRawList = () => {
        return bot.chat.sendFallible({
            patternHead: 'homes',
            command: 'get',
            successEvents: ['list', 'unset'],
            timeout: 5000
        })
    }

    bot.homes.set = (homeIdentifier) => {
        return bot.chat.sendFallible({
            patternHead: 'homes',
            command: ['set', homeIdentifier],
            successEvent: 'set',
            timeout: 5000
        })
    }

    bot.homes.delete = (homeIdentifier) => {
        return bot.chat.sendFallible({
            patternHead: 'homes',
            command: ['delete', homeIdentifier],
            successEvent: 'deleted',
            failureEvent: 'notFoundError',
            timeout: 5000
        })
    }

    bot.homes.teleportTo = (homeIdentifier) => {
        return bot.chat.sendFallible({
            patternHeads: ['homes', 'teleport'],
            command: ['teleportTo', homeIdentifier],
            successEvent: 'forcedMove',
            failureEvents: ['notFoundError', 'failure', 'spamWarning'],
            timeout: 5000
        })
    }

    bot.homes.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
