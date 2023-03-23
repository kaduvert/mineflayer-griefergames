const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const itemClear = bot.loadPatternsAndGetData('itemClear')

    bot.itemClear = {
        nextAt: null,
        events: new EventEmitter()
    }

    bot.on('chat:itemClear->nextIn', ([[secs]]) => {
        bot.itemClear.nextAt = Date.now() + (secs * 1000)
        bot.itemClear.events.emit('itemClearIn:' + secs)
    })

    bot.on('chat:itemClear->removedItems', ([[removedItems]]) => {
        bot.itemClear.nextAt = Date.now() + (20 * 60 * 1000)
        bot.itemClear.events.emit('itemClear', removedItems)
    })
}
