module.exports = function inject(bot, options) {
    const pluginId = bot.loadPatternsAndGetData('startJail')

    bot.startJail = {}

    bot.startJail.target = (username, reason) => {
        return bot.chat.getChatActionResult(
            'startJail',
            ['target', username, reason],
            'startJail:' + username,
            ['help', 'noTokensError'],
            5000,
            bot.punishment.events
        )
    }

    bot.startJail.openMenu = () => {
        return bot.chat.getChatActionResult(
            'startJail',
            'menu',
            [],
            5000
        )
    }

    bot.startJail.getTokenBalance = (window) => {
        const jailTokensIndicatorStack = bot.window.getMatchingItem(window, startJail.itemPatterns.tokenBalance)
        const jailTokenStackMatches = bot.window.getItemPatternMatches(jailTokensIndicatorStack, startJail.itemPatterns.tokenBalance)
        return jailTokenStackMatches.loreMatches[0][0]
    }

    bot.startJail.startTokenPurchase = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, startJail.itemPatterns.purchaseToken).slot,
            0,
            'startJail',
            'confirmPurchase',
            [],
            1000
        )
    }

    bot.startJail.confirmTokenPurchase = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, startJail.itemPatterns.confirmPurchase).slot,
            0,
            'startJail',
            'purchaseSuccess',
            ['insufficientBalanceError'],
            1000
        )
    }

    bot.startJail.cancelTokenPurchase = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, startJail.itemPatterns.cancelPurchase).slot,
            0,
            'startJail',
            'purchaseCancelled',
            [],
            1000
        )
    }
}