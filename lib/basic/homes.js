// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const homes = bot.loadPatternsAndGetData('homes')

    bot.homes = {}

    bot.homes.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
