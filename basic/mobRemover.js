const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const mobRemover = bot.ggData.mobRemover
    bot.chat.loadPatterns(bot.ggData.mobRemover)

    bot.mobRemover = {
        nextAt: null,
        events: new EventEmitter()
    }

    bot.on('chat:mobRemoverIn', ([[mins]]) => {
        bot.mobRemover.nextAt = Date.now() + (+mins * 60 * 1000)
        bot.mobRemover.events.emit('mobRemoverIn:' + mins)
    })

    bot.on('chat:mobRemover', ([[removedMobs]]) => {
        bot.mobRemover.nextAt = Date.now() + (mobRemover.cycleTime)
        bot.mobRemover.events.emit('mobRemover', removedMobs)
    })
}
