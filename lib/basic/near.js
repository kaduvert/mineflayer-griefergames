// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const near = bot.loadPatternsAndGetData('near')

    bot.near = {}

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

