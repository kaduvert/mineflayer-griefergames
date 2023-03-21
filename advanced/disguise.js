// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const disguise = bot.loadPatternsAndGetData('disguise')

    bot.disguise = {
        current: null
    }

    bot.disguise.as = (disguiseIdentifier) => {
        return bot.chat.getChatActionResult(
            'disguise',
            ['as', disguiseIdentifier],
            'disguised',
            ['unknownArgumentsError', 'insufficientPermissionsError', 'pluginForbidsActionError'],
            5000
        )
    }

    bot.disguise.remove = () => {
        return bot.chat.getChatActionResult(
            'disguise',
            'remove',
            'removed',
            ['notFound'],
            5000
        )
    }

    bot.disguise.getStatus = () => {
        return bot.chat.getChatActionResult(
            'disguise',
            'getStatus',
            ['status', 'notFound'],
            [],
            5000
        )
    }

    bot.on('chat:disguise->disguised', ([[disguiseIdentifier]]) => {
        bot.disguise.current = disguiseIdentifier
    })
}
