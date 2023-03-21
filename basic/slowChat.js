module.exports = function inject(bot, options) {
	const data = bot.ggData.data
	bot.chat.loadPatterns(data)
	// bot.window.loadPatterns(data)

	bot.slowChat = {
        active: false
    }

    bot.on('chat:slowChat->activated', () => {
        bot.slowChat.active = true
    })

    bot.on('chat:slowChat->deactivated', () => {
        bot.slowChat.active = false
    })
}
