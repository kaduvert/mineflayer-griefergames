module.exports = function load(bot, ns) {
    const serverInfo = ns.data['serverInfo']

    ns.serverInfo.getCurrentServer = () => bot.scoreboard.sidebar.items[2].displayName.toString()

    ns.serverInfo.getBalance = () => bot.scoreboard.sidebar.items[5].displayName.toString()

    ns.serverInfo.getOnlineCount = () => bot.scoreboard.sidebar.items[8].displayName.toString()

    ns.serverInfo.getPlaytime = () => bot.scoreboard.sidebar.items[11].displayName.toString()

    ns.serverInfo.getTranslatedServer = () => {
        const scoreboardServer = ns.serverInfo.getCurrentServer()
        if (serverInfo.scoreboardCitybuildRegex.test(scoreboardServer) || (serverInfo.nonCitybuildServer.includes(scoreboardServer.toLowerCase()) || serverInfo.abnormallyNamedCitybuildServer.includes(scoreboardServer.toLowerCase()))) {
            return scoreboardServer.toLowerCase()
        }

        const switcherName = serverInfo.scoreboardToSwitcherMap[scoreboardServer]
        if (switcherName) {
            return switcherName
        }
    }

    ns.serverInfo.getNumericBalance = () => ns.money.toNumberScoreboard(ns.serverInfo.getBalance())

    ns.serverInfo.isOnCitybuild = () => !serverInfo.nonCitybuildServer.includes(ns.serverInfo.getTranslatedServer())

    ns.serverInfo.isHub = () => ns.serverInfo.getTranslatedServer() === serverInfo.hubIdentifier

    ns.serverInfo.isPortal = () => ns.serverInfo.getTranslatedServer() === serverInfo.portalIdentifier

    ns.serverInfo.isScoreboardLoaded = () => bot.scoreboard?.sidebar?.items?.length >= 14

    bot.on('scoreboardCreated', async () => {
        const listenForLoadedInterval = setInterval(() => {
            if (ns.serverInfo.isScoreboardLoaded()) {
                bot.emit('misc:serverInfo->scoreboardLoaded')
                bot.emit('misc:serverInfo->join')

                clearInterval(listenForLoadedInterval)
            }
        }, 50)
    })
}
