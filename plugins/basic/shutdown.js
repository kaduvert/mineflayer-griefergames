// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^Der Server wird JETZT heruntergefahren!$/, 'shutdownWarning')

	bot.shutdown = {}


}
