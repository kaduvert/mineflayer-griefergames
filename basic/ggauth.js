// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.ggauth)

    bot.on('ggauthVerificationError', bot.quit)
}
