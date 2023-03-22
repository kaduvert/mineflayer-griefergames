// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const spawn = bot.loadPatternsAndGetData('spawn')
    // tpSpamWarning

    bot.spawn.teleport = () => {
        return bot.chat.getChatActionResult(
            ['spawn', 'teleport'],
            'teleport',
            'forcedMove',
            ['spamWarning'],
            5000
        )
    }
}
