module.exports = function load(bot, ns) {
    const itemClear = ns.data['itemClear']

    ns.itemClear.nextAt = null

    bot.on('chat:itemClear->nextIn', ([[secs]]) => {
        ns.itemClear.nextAt = Date.now() + (secs * 1000)
        bot.emit('misc:itemClear->in:' + secs)
    })

    bot.on('chat:itemClear->removedItems', ([[removedItems]]) => {
        ns.itemClear.nextAt = Date.now() + (20 * 60 * 1000)
        bot.emit('misc:itemClear', removedItems)
    })
}
