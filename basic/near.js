// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const near = bot.ggData.near
    bot.chat.loadPatterns(near)

    bot.near = {}

    bot.near.getRawPlayers = (distance = 200) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(near.commands.getPlayers, distance),
            'chat:nearPlayersList',
            [],
            5000
        )
    }

    bot.near.parsePlayers = (str) => {
        const nearPlayers = []
        if (str === 'keine') return nearPlayers
        str.split(near.playerListSeparator).forEach(e => {
            const [_, username, distance] = e.match(near.playerListRegex)
            nearPlayers.push({
                username,
                distance: +distance
            })
        })
        return nearPlayers
    }
}

