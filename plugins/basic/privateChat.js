module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^\[\S+ ┃ (\S+) -> mir\] (.*)$/, 'privateChatReceivedMessage')
	bot.chatAddPattern(/^\[mir -> \S+ ┃ (\S+)\] (.*)$/, 'privateChatSentMessage')
	
	bot.privateChat = {}

	bot.on('privateChatReceivedMessage', function respond(username, msg) {
		if (bot.owners.includes(username)) bot.chat.send(msg, 1)
	})

	bot.privateChat.send = (username, msg) => {
		const prefix = `/msg ${username} `
		const charLimit = 100 - prefix.length
		while (msg.length > charLimit) {
			const splitIndex = msg.substring(0, charLimit).lastIndexOf(' ') + 1 || charLimit
			bot.chat.send(prefix + msg.substring(0, splitIndex))
			bot.chat.getChatActionResult(prefix + msg.substring(0, splitIndex), 'privateChatSentMessage', ['playerNotFoundError'], 5000)
			msg = msg.substring(splitIndex)
		}
		bot.chat.getChatActionResult(prefix + msg, 'privateChatSentMessage', ['playerNotFoundError'], 5000)
	}
}

/*
// msgtoggle
Das Empfangen von Nachrichten wurde deaktiviert.
Das Empfangen von Nachrichten wurde aktiviert.
Ultra ┃ ColaKanone_HD hat Nachrichten deaktiviert.

// ignore

Du ignorierst ab jetzt Spieler Airasoon.
Du ignorierst Spieler Airasoon nicht mehr.

Ignoriert: !spionelefant557 1enton
*/