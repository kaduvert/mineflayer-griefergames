module.exports = function inject(bot, options) {
	const data = bot.ggData.data
	bot.chat.loadPatterns(data)
	// bot.window.loadPatterns(data)

	bot.slowChat = {
        active: false
    }

    bot.on('chat:slowChatActivated', () => {
        bot.slowChat.active = true
    })

    bot.on('chat:slowChatDeactivated', () => {
        bot.slowChat.active = false
    })
}
