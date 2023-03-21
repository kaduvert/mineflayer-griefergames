// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const disguise = bot.ggData.disguise
    bot.chat.loadPatterns(disguise)

    bot.disguise = {
        current: null
    }

    bot.disguise.as = (disguiseIdentifier) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(disguise.commands.as, disguiseIdentifier),
            'as',
            ['unknownArgumentsError', 'insufficientPermissionsError', 'pluginForbidsActionError'],
            5000
        )
    }

    bot.disguise.remove = () => {
        return bot.chat.getChatActionResult(
            disguise.commands.remove,
            'removed',
            ['notFound'],
            5000
        )
    }

    bot.disguise.getStatus = () => {
        return bot.chat.getChatActionResult(
            disguise.commands.getStatus,
            ['status', 'notFound'],
            [],
            5000
        )
    }

    bot.on('chat:disguise->as', ([[disguiseIdentifier]]) => {
        bot.disguise.current = disguiseIdentifier
    })
}
