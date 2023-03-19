module.exports = function inject(bot, options) {
	const privateChat = bot.ggData.privateChat
	bot.chat.loadPatterns(privateChat)

	bot.privateChat = {}

	bot.privateChat.send = (username, msg) => {
		return bot.chat.getChatActionResult(
			bot.buildCommand(privateChat.commands.send, username, msg),
			'chat:privateChatSentMessage',
			['chat:receiverToggledMessagesError', 'chat:playerNotFoundError'],
			5000
		)
	}

	bot.privateChat.toggle = () => {
		return bot.chat.getChatActionResult(
			privateChat.commands.toggle,
			['chat:privateChatActivated', 'chat:privateChatDeactivated'],
			[],
			5000
		)
	}

	bot.privateChat.toggleIgnore = (username) => {
		return bot.chat.getChatActionResult(
			bot.buildCommand(privateChat.commands.ignore, username),
			['chat:ignoreAdd', 'chat:ignoreRemove'],
			[],
			5000
		)
	}

	bot.privateChat.getIgnoredList = () => {
		return bot.chat.getChatActionResult(
			privateChat.commands.ignoredList,
			['chat:ignoreList', 'chat:ignoreListEmpty'],
			[],
			5000
		)
	}
}
