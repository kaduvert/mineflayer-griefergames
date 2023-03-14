const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[GrieferGames\] Warnung! Die auf dem Boden liegenden Items werden in (\d+) Sekunden entfernt!$/, 'itemClearIn')
    bot.chatAddPattern(/^\[GrieferGames\] Es wurden (\d+) auf dem Boden liegende Items entfernt!$/, 'itemClear')

    bot.itemClear = {
        nextAt: null,
        events: new EventEmitter()
    }

    bot.on('itemClearIn', (secs) => {
        bot.itemClear.nextAt = Date.now() + (secs * 1000)
        bot.itemClear.events.emit('itemClearIn:' + secs)
    })

    bot.on('itemClear', (removedItems) => {
        bot.itemClear.nextAt = Date.now() + (20 * 60 * 1000)
        bot.itemClear.events.emit('itemClear', removedItems)
    })
}
