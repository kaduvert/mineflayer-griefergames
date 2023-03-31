module.exports = function inject(bot, options) {
    const pluginId = bot.loadPatternsAndGetData('startJail')

    bot.startJail = {}

    bot.startJail.target = (username, reason) => {
        return bot.chat.sendFallible({
            patternHead: 'startJail',
            command: ['target', username, reason],
            successEvent: 'startJail:' + username,
            failureEvents: ['help', 'noTokensError'],
            timeout: 5000,
            successEventEmitter: bot.punishment.events
        })
    }

    bot.startJail.openMenu = () => {
        return bot.chat.sendFallible({
            patternHead: 'startJail',
            command: 'menu',
            successEvent: 'menu',
            timeout: 5000
        })
    }

    bot.startJail.getTokenBalance = (window) => {
        const jailTokensIndicatorStack = bot.window.getMatchingItem('startJail', 'tokenBalance', window)
        const jailTokenStackMatches = bot.window.getItemPatternMatches('startJail', 'tokenBalance', jailTokensIndicatorStack)
        return jailTokenStackMatches.loreMatches[0][0]
    }

    bot.startJail.startTokenPurchase = (window) => {
        return bot.window.clickFallible({
            window,
            slot: bot.window.getMatchingItem('startJail', 'purchaseToken', window).slot,
            patternHead: 'startJail',
            successEvent: 'confirmPurchase',
            currentWindowPatternName: 'menu',
            timeout: 1000
        })
    }

    bot.startJail.confirmTokenPurchase = (window) => {
        return bot.window.clickFallible({
            window,
            slot: bot.window.getMatchingItem('startJail', 'confirmPurchase', window).slot,
            patternHead: 'startJail',
            successEvent: 'purchaseSuccess',
            failureEvent: 'insufficientBalanceError',
            currentWindowPatternName: 'confirmPurchase',
            timeout: 1000
        })
    }

    bot.startJail.cancelTokenPurchase = (window) => {
        return bot.window.clickFallible({
            window,
            slot: bot.window.getMatchingItem('startJail', 'cancelPurchase', window).slot,
            patternHead: 'startJail',
            successEvent: 'purchaseCancelled',
            currentWindowPatternName: 'confirmPurchase',
            timeout: 1000
        })
    }
}