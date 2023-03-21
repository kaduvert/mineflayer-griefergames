// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
	bot.orb = {}

    bot.orb.parseOrbBalance = (str) => str.replace(/\./g, '')
}