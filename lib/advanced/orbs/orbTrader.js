module.exports = function inject(bot, options) {
    // const orb = bot.hostData['orb']
    const orbTrader = bot.hostData['orbTrader']

    bot.orb.trader.getBalance = (window) => {
        return bot.item.findMatchingIn(window, 'orb', 'orbBalance',)
    }

    bot.orb.trader.getItemSellWindow = (window, itemName) => {
        return bot.window.clickFallible({
            window,
            slot: window.slots.items().find(item => item.name === itemName).slot,
            patternHead: 'orbTrader',
            successEvent: 'sellItem',
            currentWindowPatternName: 'menu',
            timeout: 1000
        })
    }

    bot.orb.trader.sellItem = (window, quantityOption = 2) => {
        const sellOptions = bot.item.findMatchingIn(window, 'orbTrader', 'sellOption')
        return bot.window.clickFallible({
            window,
            slot: sellOptions[quantityOption],
            patternHead: 'orbTrader',
            successEvent: 'saleSuccessful',
            currentWindowPatternName: 'sellItem',
            timeout: 1000
        })
    }
}
