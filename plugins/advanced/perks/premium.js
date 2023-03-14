// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[GrieferGames\] Du hast \S+ | (\S+) den Premium Rang aktiviert\.$/, 'premiumActivated')
    bot.chatAddPattern(/^\[GrieferGames\] Du kannst erst am (.+) wieder den Premium-Rang vergeben\.$/, 'premiumCooldownError')

	bot. = {}


}
