module.exports = function inject(bot, options) {
	const privateChat = bot.loadPatternsAndGetData('privateChat')

	bot.privateChat = {}

	bot.privateChat.send = (username, msg) => {
		return bot.chat.sendFallibe(
			'privateChat',
			['send', username, msg],
			'sentMessage',
			['receiverToggledMessagesError', 'playerNotFoundError'],
			5000
		)
	}

	bot.privateChat.toggle = () => {
		return bot.chat.sendFallibe(
			'privateChat',
			'toggle',
			['activated', 'deactivated'],
			[],
			5000
		)
	}
}
