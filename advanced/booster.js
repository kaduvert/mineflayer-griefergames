// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chat.loadPatterns(bot.ggData.booster)

    bot.booster = {}
}
