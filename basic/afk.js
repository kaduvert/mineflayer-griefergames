module.exports = function inject(bot, options) {
    const afk = bot.loadPatternsAndGetData('afk')

    bot.afk = {}

    bot.afk.pass = (window) => {
        return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, afk.itemPatterns.notAfk).slot,
            0,
            'afk',
            'windowClose',
            [],
            1000
        )
    }
}
