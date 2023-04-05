module.exports = function inject(bot, options) {
    const mobRemover = bot.hostData['mobRemover']

    bot.mobRemover.nextAt = null

    bot.on('chat:mobRemover->nextIn', ([[mins]]) => {
        bot.mobRemover.nextAt = Date.now() + (+mins * 60 * 1000)
        bot.emit('misc:mobRemover->in:' + mins)
    })

    bot.on('chat:mobRemover->removedMobs', ([[removedMobs]]) => {
        bot.mobRemover.nextAt = Date.now() + (mobRemover.cycleTime)
        bot.emit('misc:mobRemover', removedMobs)
    })
}
