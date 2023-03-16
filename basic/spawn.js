// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.spawn)

    // tpSpamWarning

    bot.spawn.teleport = () => {
        return bot.chat.getChatActionResult('/spawn', 'forcedMove', ['tpSpamWarning'], 5000)
    }
}

