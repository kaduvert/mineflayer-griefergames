module.exports = function inject(bot, options) {
	bot.on('windowOpen', (window) => {
		if (window.title !== '"§cBist du AFK?"') return
		bot.clickWindow(0, 0, 0)
	})
}
