const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.serverInfo = {
        events: new EventEmitter()
    }

    bot.serverInfo.getCurrentServer = () => bot.scoreboard.sidebar.items[2].displayName.toString()

    bot.serverInfo.getBalance = () => bot.scoreboard.sidebar.items[5].displayName.toString()

    bot.serverInfo.getOnlineCount = () => bot.scoreboard.sidebar.items[8].displayName.toString()

    bot.serverInfo.getPlaytime = () => bot.scoreboard.sidebar.items[11].displayName.toString()

    bot.serverInfo.getTranslatedServer = () => {
        const scoreboardServer = bot.serverInfo.getCurrentServer()
        if (/^CB\d+/.test(scoreboardServer) || ['lobby', 'portal', 'extreme', 'nature'].includes(scoreboardServer.toLowerCase())) {
            return scoreboardServer.toLowerCase()
        }

        if (scoreboardServer === 'Event') return 'eventserver'
        if (scoreboardServer === 'CBE') return 'cbevil'
        if (scoreboardServer === 'Wasser') return 'farm1'
        if (scoreboardServer === 'Lava') return 'nether1'
    }

    bot.serverInfo.isOnCitybuild = () => !['lobby', 'portal'].includes(bot.serverInfo.getTranslatedServer())

    bot.serverInfo.isHub = () => bot.serverInfo.getTranslatedServer() === 'lobby'

    bot.serverInfo.isPortal = () => bot.serverInfo.getTranslatedServer() === 'portal'

    bot.on('scoreUpdated', (_, scoreboardItem) => {
        if (scoreboardItem.value === 14) {
            bot.serverInfo.events.emit('scoreboardLoaded')
            bot.serverInfo.events.emit('join')
        }
    })
}
