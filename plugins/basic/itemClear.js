const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[GrieferGames\] Warnung! Die auf dem Boden liegenden Items werden in (\d+) Sekunden entfernt!$/, 'itemClearIn')
    bot.chatAddPattern(/^\[GrieferGames\] Es wurden (\d+) auf dem Boden liegende Items entfernt!$/, 'itemClear')

    bot.itemClear = {
        events: new EventEmitter()
    }

    bot.on('itemClearIn', (secs) => {
        bot.itemClear.events.emit('itemClearIn:' + secs)
    })

    bot.on('itemClear', (removedItems) => {
        bot.itemClear.events.emit('itemClear', removedItems)
    })
}
