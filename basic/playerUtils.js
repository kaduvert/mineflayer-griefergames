const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const playerUtils = bot.ggData.playerUtils
    bot.loadChatPatterns(playerUtils)
    bot.loadWindowPatterns(playerUtils)

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
            bot.buildCommand(playerUtils.commands.getInventory, username),
            'windowOpen:inventory',
            ['chat:playerNotFoundError'],
            5000,
            bot.playerUtils.events
        )
    }

    bot.playerUtils.getEnderChest = (username) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(playerUtils.commands.getEnderChest, username),
            'windowOpen:enderChest',
            ['chat:playerNotFoundError'],
            5000,
            bot.playerUtils.events
        )
    }

    bot.playerUtils.getMiscView = (username) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(playerUtils.commands.getMiscView, username),
            'windowOpen:miscView',
            ['chat:playerNotFoundError'],
            6000,
            bot.playerUtils.events
        )
    }
}
