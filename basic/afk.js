module.exports = function inject(bot, options) {
	const afk = bot.ggData.afk
	bot.window.loadPatterns(afk)

	bot.afk.pass = (window) => {
		return bot.window.getClickActionResult(
            window,
            bot.window.getMatchingItem(window, afk.itemPatterns.notAfk).slot,
            0,
            'windowClose',
            [],
            1000
        )
	}
}
