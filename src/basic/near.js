// const EventEmitter = require('events')

module.exports = function load(bot, ns) {
    const near = ns.data['near']

    ns.near.parsePlayers = (str) => {
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

    ns.near.get = () => (bot.gg.near.parsePlayers((await bot.gg.near.getPlayers()).eventArgs[0][0][0]))
}
