// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const orb = bot.ggData.orb
    const orbTrader = bot.ggData.orbTrader
    bot.chat.loadPatterns(orbTrader)
    bot.window.loadPatterns(orbTrader)

    bot.orb.trader = {
        // events: new EventEmitter()
    }

    bot.orb.trader.getBalance = (window) => {
        return bot.window.getMatchingItem(window, orb.itemPatterns.orbBalance)
    }

    bot.orb.trader.getItemSellWindow = (window, itemName) => {
        return bot.window.getClickActionResult(
            window,
            window.slots.items().find(item => item.name === itemName).slot,
            0,
            'windowOpen:orbSellItem',
            [],
            1000
        )
    }

    bot.orb.trader.sellItem = (window, quantityOption = 2) => {
        const sellOptions = bot.window.getMatchingItem(window, orbTrader.itemPatterns.sellOption)
        return bot.window.getClickActionResult(
            window,
            sellOptions[quantityOption],
            0,
            'chat:orbSaleSuccessful',
            [],
            1000
        )
    }
}
