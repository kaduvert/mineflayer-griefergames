// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chat.loadPatterns(bot.ggData.ggauth)

    // bot.on('chat:ggauthVerificationError', bot.quit)
}
