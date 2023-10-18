module.exports = function inject(bot, options) {
    const serverInfo = bot.hostData['serverInfo']

    bot.serverInfo.getCurrentServer = () => bot.scoreboard.sidebar.items[2].displayName.toString()

    bot.serverInfo.getBalance = () => bot.scoreboard.sidebar.items[5].displayName.toString()

    bot.serverInfo.getOnlineCount = () => bot.scoreboard.sidebar.items[8].displayName.toString()

    bot.serverInfo.getPlaytime = () => bot.scoreboard.sidebar.items[11].displayName.toString()

    bot.serverInfo.getTranslatedServer = () => {
        const scoreboardServer = bot.serverInfo.getCurrentServer()
        if (serverInfo.scoreboardCitybuildRegex.test(scoreboardServer) || (serverInfo.nonCitybuildServer.includes(scoreboardServer.toLowerCase()) || serverInfo.abnormallyNamedCitybuildServer.includes(scoreboardServer.toLowerCase()))) {
            return scoreboardServer.toLowerCase()
        }

        const switcherName = serverInfo.scoreboardToSwitcherMap[scoreboardServer]
        if (switcherName) {
            return switcherName
        }
    }

    bot.serverInfo.getNumericBalance = () => bot.money.toNumberScoreboard(bot.serverInfo.getBalance())

    bot.serverInfo.isOnCitybuild = () => !serverInfo.nonCitybuildServer.includes(bot.serverInfo.getTranslatedServer())

    bot.serverInfo.isHub = () => bot.serverInfo.getTranslatedServer() === serverInfo.hubIdentifier

    bot.serverInfo.isPortal = () => bot.serverInfo.getTranslatedServer() === serverInfo.portalIdentifier

    bot.serverInfo.isScoreboardLoaded = () => bot.scoreboard?.sidebar?.items?.length >= 14

    bot.on('scoreboardCreated', async () => {
        const listenForLoadedInterval = setInterval(() => {
            if (bot.serverInfo.isScoreboardLoaded()) {
                bot.emit('misc:serverInfo->scoreboardLoaded')
                bot.emit('misc:serverInfo->join')

                clearInterval(listenForLoadedInterval)
            }
        }, 50)
    })
}
