module.exports = function inject(bot, options) {
    const pluginId = bot.ggData.loadPatternsAndGetData('afk')

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
