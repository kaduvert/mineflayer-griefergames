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

        const nicknamedPlayer = Object.values(bot.players).find(player => {
            const splitDisplayName = player.displayName.toString().split(' ')
            if (splitDisplayName.length !== 3) return false
            return splitDisplayName[2] === nickname
        })

        return nicknamedPlayer.username ?? null
    }

    bot.playerUtils.getInventory = (username) => {
        return bot.chat.sendFallible({
            patternHead: 'playerUtils',
            command: ['getInventory', username],
            successEvent: 'inventory',
            failureEvent: 'playerNotFoundError',
            timeout: 5000
        })
    }

    bot.playerUtils.getEnderChest = (username) => {
        return bot.chat.sendFallible({
            patternHead: 'playerUtils',
            command: ['getEnderChest', username],
            successEvent: 'enderChest',
            failureEvent: 'playerNotFoundError',
            timeout: 5000
        })
    }

    bot.playerUtils.getMiscView = (username) => {
        return bot.chat.sendFallible({
            patternHead: 'playerUtils',
            command: ['getMiscView', username],
            successEvent: 'miscView',
            failureEvent: 'playerNotFoundError',
            timeout: 6000
        })
    }
}
