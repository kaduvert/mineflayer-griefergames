module.exports = function inject(bot, options) {
    const itemClear = bot.hostData['itemClear']

    bot.itemClear.nextAt = null

    bot.on('chat:itemClear->nextIn', ([[secs]]) => {
        bot.itemClear.nextAt = Date.now() + (secs * 1000)
        bot.emit('misc:itemClear->in:' + secs)
    })

    bot.on('chat:itemClear->removedItems', ([[removedItems]]) => {
        bot.itemClear.nextAt = Date.now() + (20 * 60 * 1000)
        bot.emit('misc:itemClear', removedItems)
    })
}
