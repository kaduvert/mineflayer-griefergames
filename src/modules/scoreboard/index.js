module.exports = function load(bot, ns) {
    const scoreboard = ns['scoreboard'].data

    ns.scoreboard.getCurrentServer = () => bot.scoreboard.sidebar.items[2].displayName.toString()

    ns.scoreboard.getBalance = () => bot.scoreboard.sidebar.items[5].displayName.toString()

    ns.scoreboard.getOnlineCount = () => bot.scoreboard.sidebar.items[8].displayName.toString()

    ns.scoreboard.getPlaytime = () => bot.scoreboard.sidebar.items[11].displayName.toString()

    ns.scoreboard.getTranslatedServer = (server = ns.scoreboard.getCurrentServer()) => {
        if (scoreboard.scoreboardCitybuildRegex.test(server) || (scoreboard.nonCitybuildServer.includes(server.toLowerCase()) || scoreboard.abnormallyNamedCitybuildServer.includes(server.toLowerCase()))) {
            return server.toLowerCase()
        }

        const switcherName = scoreboard.scoreboardToSwitcherMap[server]
        if (switcherName) {
            return switcherName
        }
    }

    ns.scoreboard.getNumericBalance = () => ns.money.toNumberScoreboard(ns.scoreboard.getBalance())

    ns.scoreboard.isOnCitybuild = () => !scoreboard.nonCitybuildServer.includes(ns.scoreboard.getTranslatedServer())

    ns.scoreboard.isHub = () => ns.scoreboard.getTranslatedServer() === scoreboard.hubIdentifier

    ns.scoreboard.isPortal = () => ns.scoreboard.getTranslatedServer() === scoreboard.portalIdentifier

    ns.scoreboard.isScoreboardLoaded = () => bot.scoreboard?.sidebar?.items?.length >= 14

    ns.serverInfo = ns.scoreboard

    bot.on('scoreboardCreated', async () => {
        const listenForLoadedInterval = setInterval(() => {
            if (ns.scoreboard.isScoreboardLoaded()) {
                bot.emit('misc:scoreboard->loaded')
                bot.emit('misc:scoreboard->join')

                bot.emit('misc:serverInfo->scoreboardLoaded')
                bot.emit('misc:serverInfo->join')

                clearInterval(listenForLoadedInterval)
            }
        }, 50)
    })
}
