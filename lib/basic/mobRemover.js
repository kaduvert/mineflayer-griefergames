module.exports = function load(bot, ns) {
    const mobRemover = ns.data['mobRemover']

    ns.mobRemover.nextAt = null

    bot.on('chat:mobRemover->nextIn', ([[mins]]) => {
        ns.mobRemover.nextAt = Date.now() + (+mins * 60 * 1000)
        bot.emit('misc:mobRemover->in:' + mins)
    })

    bot.on('chat:mobRemover->removedMobs', ([[removedMobs]]) => {
        ns.mobRemover.nextAt = Date.now() + (mobRemover.cycleTime)
        bot.emit('misc:mobRemover', removedMobs)
    })
}
