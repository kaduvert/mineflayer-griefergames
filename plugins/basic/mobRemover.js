const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[MobRemover\] Achtung, in (\d+) Minuten? werden alle Tiere gelöscht\.$/, 'mobRemoverIn')
    bot.chatAddPattern(/^\[MobRemover\] Es wurden (\d+) Tiere entfernt\.$/, 'mobRemover')
    
    bot.mobRemover = {
        nextAt: null,
        events: new EventEmitter()
    }

    bot.on('mobRemoverIn', (mins) => {
        bot.mobRemover.nextAt = Date.now() + (+mins * 60 * 1000)
        bot.mobRemover.events.emit('mobRemoverIn:' + mins)
    })

    bot.on('mobRemover', (removedMobs) => {
        bot.mobRemover.nextAt = Date.now() + (20 * 60 * 1000)
        bot.mobRemover.events.emit('mobRemover', removedMobs)
    })
}
