// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const home = bot.ggData.home
    bot.chat.loadPatterns(home)
    // tpFailure
    // tpSpamWarning

    bot.home = {}

    bot.home.getRawList = () => {
        return bot.chat.getChatActionResult(
            home.commands.getHomes,
            ['list', 'unset'],
            [],
            5000
        )
    }

    bot.home.setHome = (homeIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(home.commands.setHome, homeIdentifier),
            'set',
            [],
            5000
        )
    }

    bot.home.deleteHome = (homeIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(home.commands.deleteHome, homeIdentifier),
            'deleted',
            ['notFoundError'],
            5000
        )
    }

    bot.home.teleportTo = (homeIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(home.commands.teleportTo, homeIdentifier),
            'forcedMove',
            ['notFoundError', 'chat:tpFailure', 'chat:tpSpamWarning'],
            5000
        )
    }

    bot.home.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
