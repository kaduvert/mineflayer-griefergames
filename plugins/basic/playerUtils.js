module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^Fehler: Spieler nicht gefunden\.$/, 'playerNotFoundError')
    bot.chatAddPattern(/^\[GrieferGames\] Der Spieler \S+ wurde nicht gefunden\.$/, 'playerNotFoundError')
    bot.chatAddPattern(/^\[GrieferGames\] Der Spieler ist nicht online!$/, 'playerNotFoundError')

    bot.playerUtils = {}

    bot.playerUtils.getRank = (username = bot.entity.username) => {
        const displayNameParts = bot.players[username].displayName.toString().split(' ')
        if (displayNameParts.length === 3) {
            return displayNameParts[0]
        }
        return null
    }

    bot.playerUtils.resolveNickname = (nickname) => {
		if (!nickname.startsWith('~') || bot.players[nickname]) return nickname

        for (const player of Object.values(bot.players)) {
            const splitDisplayName = player.displayName.toString().split(' ')
            if (splitDisplayName.length !== 3) continue
            if (splitDisplayName[2] === nickname) return player.username
        }
        return null
	}

    bot.playerUtils.getInventory = (username) => {
        return bot.chat.getChatActionResult(`/invsee ${username}`, 'windowOpen', ['playerNotFoundError'], 5000)
    }

    bot.playerUtils.getEnderChest = (username) => {
        return bot.chat.getChatActionResult(`/ec ${username}`, 'windowOpen', ['playerNotFoundError'], 5000)
    }

    bot.playerUtils.getMiscView = (username) => {
        return bot.chat.getChatActionResult(`/view ${username}`, 'windowOpen', ['playerNotFoundError'], 6000)
    }
}
