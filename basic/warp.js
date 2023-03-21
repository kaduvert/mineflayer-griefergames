// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const warp = bot.ggData.warp
    bot.chat.loadPatterns(warp)

    // tpSpamWarning

    bot.warp = {}

    bot.warp.getList = () => {
        return bot.chat.getChatActionResult(
            warp.commands.getList,
            'list',
            [],
            5000
        )
    }

    bot.warp.to = (point) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(warp.commands.to, point),
            'forcedMove',
            ['chat:tpSpamWarning'],
            5000
        )
    }
}
