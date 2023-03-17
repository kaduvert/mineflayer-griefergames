module.exports = function inject(bot, options) {
	const privateChat = bot.ggData.privateChat
    bot.loadChatPatterns(privateChat)

	bot.privateChat = {}

	bot.privateChat.send = (username, msg) => {
		const prefix = privateChat.commands.send(username)
		const charLimit = 100 - prefix.length
		while (msg.length > charLimit) {
			const splitIndex = msg.substring(0, charLimit).lastIndexOf(' ') + 1 || charLimit
			bot.chat.send(prefix + msg.substring(0, splitIndex))
			bot.chat.getChatActionResult(prefix + msg.substring(0, splitIndex), 'chat:privateChatSentMessage', ['playerNotFoundError'], 5000)
			msg = msg.substring(splitIndex)
		}
		bot.chat.getChatActionResult(prefix + msg, 'chat:privateChatSentMessage', ['playerNotFoundError'], 5000)
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