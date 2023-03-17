// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const warp = bot.ggData.warp
    bot.loadChatPatterns(warp)

    // tpSpamWarning

    bot.warp = {}

    bot.warp.getList = () => {
        return bot.chat.getChatActionResult(warp.commands.getList(), 'chat:warpList', [], 5000)
    }

    bot.warp.to = (point) => {
        return bot.chat.getChatActionResult(warp.commands.to(point), 'forcedMove', ['chat:tpSpamWarning'], 5000)
    }
}
