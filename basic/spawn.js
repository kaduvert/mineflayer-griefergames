// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const spawn = bot.ggData.spawn
    bot.chat.loadPatterns(spawn)

    // tpSpamWarning

    bot.spawn.teleport = () => {
        return bot.chat.getChatActionResult(
            spawn.commands.teleport,
            'forcedMove',
            ['chat:tpSpamWarning'],
            5000
        )
    }
}

