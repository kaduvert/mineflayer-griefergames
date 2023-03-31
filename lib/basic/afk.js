module.exports = function inject(bot, options) {
    const afk = bot.loadPatternsAndGetData('afk')

    bot.afk = {}

    bot.afk.pass = (window) => {
        return bot.window.clickFallible({
            window,
            slot: bot.window.getMatchingItem('afk', 'notAfk', window).slot,
            patternHead: 'afk',
            successEvent: 'windowClose',
            timeout: 1000
        })
    }
}
