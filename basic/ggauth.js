// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.ggauth)

    // bot.on('chat:ggauthVerificationError', bot.quit)
}
