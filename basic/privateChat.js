module.exports = function inject(bot, options) {
	const privateChat = bot.ggData.privateChat
	bot.chat.loadPatterns(privateChat)

	bot.privateChat = {}

	bot.privateChat.send = (username, msg) => {
		return bot.chat.getChatActionResult(
			bot.buildCommand(privateChat.commands.send, username, msg),
			'sentMessage',
			['receiverToggledMessagesError', 'playerNotFoundError'],
			5000
		)
	}

	bot.privateChat.toggle = () => {
		return bot.chat.getChatActionResult(
			privateChat.commands.toggle,
			['activated', 'deactivated'],
			[],
			5000
		)
	}
}
