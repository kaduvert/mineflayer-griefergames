module.exports = function inject(bot, options) {
	const antiAfk = bot.ggData.antiAfk
	bot.window.loadPatterns(antiAfk)

	bot.on('windowOpen:afkPopup', () => {
		bot.clickWindow(0, 0, 0)
	})
}
