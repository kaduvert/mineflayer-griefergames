module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    class AbsolutePlot {
        constructor(id) {
            if (typeof id === 'string' && id.includes(plot.info.idSeparator)) {
                this.id = id.split(plot.info.idSeparator).map(e => +e)
            } else {
                this.id = id
            }
        }

        get idString() {
            return this.id.join(plot.info.idSeparator)
        }

        setAlias(alias) {
            return bot.plot.setAlias(this.idString, alias)
        }
        removeAlias() {
            return bot.plot.removeAlias(this.idString)
        }

        setBiome(biome) {
            return bot.plot.setBiome(this.idString, biome)
        }

        kick(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.kick(this.idString, players)
        }
        ban(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.ban(this.idString, players)
        }

        add(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.add(this.idString, players)
        }
        trust(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.trust(this.idString, players)
        }

        remove(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.remove(this.idString, players)
        }

        getInfo() {
            return bot.plot.info.get(this.idString)
        }
    }

    bot.plot.fromPositionVarying = () => new AbsolutePlot([])

    bot.plot.fromPositionFixed = () => new AbsolutePlot(bot.plot.coordination.positionToId())

    bot.plot.fromId = (id) => new AbsolutePlot(id)

    // abstracting the class away for easier use
    const varyingPositionPlot = bot.plot.fromPositionVarying()

    bot.plot.setAlias = varyingPositionPlot.setAlias
    bot.plot.removeAlias = varyingPositionPlot.removeAlias
    bot.plot.setBiome = varyingPositionPlot.setBiome
    bot.plot.kick = varyingPositionPlot.kick
    bot.plot.ban = varyingPositionPlot.ban
    bot.plot.add = varyingPositionPlot.add
    bot.plot.trust = varyingPositionPlot.trust
    bot.plot.remove = varyingPositionPlot.remove

}