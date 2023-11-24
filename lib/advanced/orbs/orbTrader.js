module.exports = function load(bot, ns) {
    const orbs = ns.data['orbs']

    ns.orb.trader.getBalance = (window) => {
        return bot.pattern.item.findMatching(window, orbs.itemPatterns.orbBalance)
    }

    ns.orb.trader.getItemSellWindow = (window, itemName) => {
        return ns.window.clickFallible({
            window,
            slot: window.slots.items().find(item => item.name === itemName).slot,
            patternHead: 'orbTrader',
            successEvent: 'sellItem',
            currentWindowPatternName: 'menu',
            timeout: 1000
        })
    }

    ns.orb.trader.sellItem = (window, quantityOption = 2) => {
        const sellOptions = bot.pattern.item.findMatching(window, orbs.itemPatterns.sellOption)
        return ns.window.clickFallible({
            window,
            slot: sellOptions[quantityOption],
            patternHead: 'orbTrader',
            successEvent: 'saleSuccessful',
            currentWindowPatternName: 'sellItem',
            timeout: 1000
        })
    }
}
