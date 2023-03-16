// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.shutdown)

	bot.shutdown = {}

}
