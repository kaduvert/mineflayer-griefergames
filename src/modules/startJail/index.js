module.exports = function load(bot, ns) {
    const pluginId = ns['startJail'].data

    ns.startJail.getTokenBalance = (window) => {
        const jailTokensIndicatorStack = bot.pattern.item.findMatching(window, startJail.itemPatterns.tokenBalance)
        const jailTokenStackMatches = bot.pattern.item.getMatches(startJail.itemPatterns.tokenBalance, jailTokensIndicatorStack)
        return jailTokenStackMatches.loreMatches[0][0]
    }
}
