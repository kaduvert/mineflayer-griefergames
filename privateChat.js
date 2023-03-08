module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^\[([^ ]+) ┃ ([^ ]+) -> mir\] (.*)$/, 'msg')
	
	bot.privateChat = {}

	bot.on('msg', function respond(rank, username, msg) {
		if (bot.owners.includes(username)) bot.chat.send(msg, 1)
	})

	bot.privateChat.send = (username, msg) => {
		const prefix = `/msg ${username} `
		const charLimit = 100 - prefix.length
		while (msg.length > charLimit) {
			const splitIndex = msg.substring(0, charLimit).lastIndexOf(' ') + 1 || charLimit
			bot.chat.send(prefix + msg.substring(0, splitIndex))
			msg = msg.substring(splitIndex)
		}
		bot.chat.send(prefix + msg)
	}
}