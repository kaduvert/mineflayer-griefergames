module.exports = function inject(bot, options) {
	const antiAfk = bot.ggData.antiAfk
	const ChatMessage = require('prismarine-chat')(bot.version)

	bot.on('windowOpen', async (window) => {
		if (new ChatMessage(window.title).toString() === antiAfk.windowTitle) {
			await bot.clickWindow(0, 0, 0)
			bot.closeWindow(window)
		}
	})
}
