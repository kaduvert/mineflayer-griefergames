const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const mobRemover = bot.ggData.mobRemover
    bot.loadChatPatterns(bot.ggData.mobRemover)

    bot.mobRemover = {
        nextAt: null,
        events: new EventEmitter()
    }

    bot.on('mobRemoverIn', (mins) => {
        bot.mobRemover.nextAt = Date.now() + (+mins * 60 * 1000)
        bot.mobRemover.events.emit('mobRemoverIn:' + mins)
    })

    bot.on('mobRemover', (removedMobs) => {
        bot.mobRemover.nextAt = Date.now() + (mobRemover.cycleTime)
        bot.mobRemover.events.emit('mobRemover', removedMobs)
    })
}
