// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    // const orb = bot.loadPatternsAndGetData('orb')
    const orbTrader = bot.loadPatternsAndGetData('orbTrader')

    bot.orb.trader = {
        // events: new EventEmitter()
    }

    bot.orb.trader.getBalance = (window) => {
        return bot.window.getMatchingItem('orb', 'orbBalance', window)
    }

    bot.orb.trader.getItemSellWindow = (window, itemName) => {
        return bot.window.getClickActionResult(
            window,
            window.slots.items().find(item => item.name === itemName).slot,
            0,
            'sellItem',
            [],
            1000
        )
    }

    bot.orb.trader.sellItem = (window, quantityOption = 2) => {
        const sellOptions = bot.window.getMatchingItem('orbTrader', 'sellOption', window)
        return bot.window.getClickActionResult(
            window,
            sellOptions[quantityOption],
            0,
            'saleSuccessful',
            [],
            1000
        )
    }
}
