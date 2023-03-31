module.exports = function inject(bot, options) {
	const privateChat = bot.loadPatternsAndGetData('privateChat')

	bot.privateChat = {}

	bot.privateChat.send = (username, msg) => {
		return bot.chat.sendFallible({
			patternHead: 'privateChat',
			command: ['send', username, msg],
			successEvent: 'sentMessage',
			failureEvents: ['receiverToggledMessagesError', 'playerNotFoundError'],
			timeout: 5000
		})
	}

	bot.privateChat.toggle = () => {
		return bot.chat.sendFallible({
			patternHead: 'privateChat',
			command: 'toggle',
			successEvents: ['activated', 'deactivated'],
			timeout: 5000
		})
	}
}
