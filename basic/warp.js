// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.warp)

    // tpSpamWarning

    bot.warp = {}

    bot.warp.getList = () => {
        return bot.chat.getChatActionResult('/warps', 'warpList', [], 5000)
    }

    bot.warp.teleportTo = (warpPoint) => {
        return bot.chat.getChatActionResult(`/warp ${warpPoint}`, 'forcedMove', ['tpSpamWarning'], 5000)
    }
}
