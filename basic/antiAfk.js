module.exports = function inject(bot, options) {
	bot.on('windowOpen', async (window) => {
		if (window.title !== '"§cBist du AFK?"') return
		await bot.clickWindow(0, 0, 0)
		bot.closeWindow(window)
	})
}
