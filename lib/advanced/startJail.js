module.exports = function inject(bot, options) {
    const pluginId = bot.loadPatternsAndGetData('startJail')

    bot.startJail = {}

    bot.startJail.target = (username, reason) => {
        return bot.chat.sendFallibe(
            'startJail',
            ['target', username, reason],
            'startJail:' + username,
            ['help', 'noTokensError'],
            5000,
            bot.punishment.events
        )
    }

    bot.startJail.openMenu = () => {
        return bot.chat.sendFallibe(
            'startJail',
            'menu',
            [],
            5000
        )
    }

    bot.startJail.getTokenBalance = (window) => {
        const jailTokensIndicatorStack = bot.window.getMatchingItem('startJail', 'tokenBalance', window)
        const jailTokenStackMatches = bot.window.getItemPatternMatches('startJail', 'tokenBalance', jailTokensIndicatorStack)
        return jailTokenStackMatches.loreMatches[0][0]
    }

    bot.startJail.startTokenPurchase = (window) => {
        return bot.window.click(
            window,
            bot.window.getMatchingItem('startJail', 'purchaseToken', window).slot,
            0,
            'startJail',
            'confirmPurchase',
            [],
            1000
        )
    }

    bot.startJail.confirmTokenPurchase = (window) => {
        return bot.window.click(
            window,
            bot.window.getMatchingItem('startJail', 'confirmPurchase', window).slot,
            0,
            'startJail',
            'purchaseSuccess',
            ['insufficientBalanceError'],
            1000
        )
    }

    bot.startJail.cancelTokenPurchase = (window) => {
        return bot.window.click(
            window,
            bot.window.getMatchingItem('startJail', 'cancelPurchase', window).slot,
            0,
            'startJail',
            'purchaseCancelled',
            [],
            1000
        )
    }
}