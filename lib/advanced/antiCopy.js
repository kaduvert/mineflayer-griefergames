module.exports = function inject(bot, options) {
    const antiCopy = bot.hostData['antiCopy']

    bot.antiCopy.getProtector = (stack) => {
        if (bot.item.matchesPattern('antiCopy', 'protectedMap', stack)) {
            return bot.item.getPatternMatches('antiCopy', 'protectedMap', stack)[0][0]
        }
        return null
    }
}
