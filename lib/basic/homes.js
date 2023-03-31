// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const homes = bot.loadPatternsAndGetData('homes')
    // tpFailure
    // tpSpamWarning

    bot.homes = {}

    bot.homes.getRawList = () => {
        return bot.chat.sendFallibe(
            'homes',
            'get',
            ['list', 'unset'],
            [],
            5000
        )
    }

    bot.homes.set = (homeIdentifier) => {
        return bot.chat.sendFallibe(
            'homes',
            ['set', homeIdentifier],
            'set',
            [],
            5000
        )
    }

    bot.homes.delete = (homeIdentifier) => {
        return bot.chat.sendFallibe(
            'homes',
            ['delete', homeIdentifier],
            'deleted',
            ['notFoundError'],
            5000
        )
    }

    bot.homes.teleportTo = (homeIdentifier) => {
        return bot.chat.sendFallibe(
            ['homes', 'teleport'],
            ['teleportTo', homeIdentifier],
            'forcedMove',
            ['notFoundError', 'failure', 'spamWarning'],
            5000
        )
    }

    bot.homes.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
