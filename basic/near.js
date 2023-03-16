// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.near)

	bot.near = {}

    bot.near.getRawPlayers = (distance = 200) => {
        return bot.chat.getChatActionResult(`/near ${distance}`, 'nearPlayersList', [], 5000)
    }

    bot.near.parsePlayers = (str) => {
        console.log(str)
        const nearPlayers = []
        if (str === 'keine') return nearPlayers
        str.split(', ').forEach(e => {
            const [_, username, distance] = e.match(/^\S+ ┃ (\S+)\((\d+)m\)$/)
            nearPlayers.push({
                username,
                distance: +distance
            })
        })
        return nearPlayers
    }
}

