module.exports = function inject(bot, options) {
    const afk = bot.loadPatternsAndGetData('afk')

    bot.afk = {}

    bot.afk.pass = (window) => {
        return bot.window.clickFallible({
            window,
            slot: bot.item.findMatchingIn(window, 'afk', 'notAfk').slot,
            patternHead: 'afk',
            successEvent: 'windowClose',
            timeout: 1000
        })
    }
}
