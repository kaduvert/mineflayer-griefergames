const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const playerUtils = bot.loadPatternsAndGetData('playerUtils')

    bot.playerUtils = {
        events: new EventEmitter()
    }

    bot.playerUtils.getRank = (username = bot.entity.username) => {
        const displayNameParts = bot.players[username].displayName.toString().split(' ')
        if (displayNameParts.length === 3) {
            return displayNameParts[0]
        }
        return null
    }

    bot.playerUtils.resolveNickname = (nickname) => {
        if (!nickname.startsWith(playerUtils.nicknamePrefix) || bot.players[nickname]) return nickname

        for (const player of Object.values(bot.players)) {
            const splitDisplayName = player.displayName.toString().split(' ')
            if (splitDisplayName.length !== 3) continue
            if (splitDisplayName[2] === nickname) return player.username
        }
        return null
    }

    bot.playerUtils.getInventory = (username) => {
        return bot.chat.getChatActionResult(
            'playerUtils',
            ['getInventory', username],
            'inventory',
            ['playerNotFoundError'],
            5000
        )
    }

    bot.playerUtils.getEnderChest = (username) => {
        return bot.chat.getChatActionResult(
            'playerUtils',
            ['getEnderChest', username],
            'enderChest',
            ['playerNotFoundError'],
            5000
        )
    }

    bot.playerUtils.getMiscView = (username) => {
        return bot.chat.getChatActionResult(
            'playerUtils',
            ['getMiscView', username],
            'miscView',
            ['playerNotFoundError'],
            6000
        )
    }
}
