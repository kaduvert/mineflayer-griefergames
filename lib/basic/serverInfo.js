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

    bot.serverInfo.getNumericBalance = () => {
        const balStr = bot.serverInfo.getBalance()

        return +(balStr.substring(0, balStr.length - 1).replace(/\./g, '').replace(/,/g, '.'))
    }

    bot.serverInfo.isOnCitybuild = () => !serverInfo.nonCitybuildServer.includes(bot.serverInfo.getTranslatedServer())

    bot.serverInfo.isHub = () => bot.serverInfo.getTranslatedServer() === serverInfo.hubIdentifier

    bot.serverInfo.isPortal = () => bot.serverInfo.getTranslatedServer() === serverInfo.portalIdentifier

    bot.on('scoreboardCreated', async () => {
        //await bot.delay(2500)
        while (true) {
            await bot.delay(50)
            if (bot.scoreboard.sidebar.items.length >= 14) {
                bot.emit('misc:serverInfo->scoreboardLoaded')
                bot.emit('misc:serverInfo->join')

                break
            }
        }
    })
}
