module.exports = function inject(bot, options) {
    const afk = bot.loadPatternsAndGetData('afk')

    bot.afk = {}

    bot.afk.pass = (window) => {
        return bot.window.click(
            window,
            bot.window.getMatchingItem('afk', 'notAfk', window).slot,
            0,
            'afk',
            'windowClose',
            [],
            1000
        )
    }
}
