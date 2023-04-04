module.exports = function inject(bot, options) {
    const pluginId = bot.loadPatternsAndGetData('startJail')

    bot.startJail = {}

    bot.startJail.getTokenBalance = (window) => {
        const jailTokensIndicatorStack = bot.item.findMatchingIn(window, 'startJail', 'tokenBalance')
        const jailTokenStackMatches = bot.item.getPatternMatches('startJail', 'tokenBalance', jailTokensIndicatorStack)
        return jailTokenStackMatches.loreMatches[0][0]
    }
}