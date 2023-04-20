module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    class AbsolutePlot {
        constructor(id) {
            if (typeof id === 'string') {
                this.id = id.split(plot.info.idSeparator).map(e => +e)
            } else {
                this.id = id
            }
        }

        setAlias(alias) {
            return bot.plot.setAlias(this.id, alias)
        }
        removeAlias() {
            return bot.plot.removeAlias(this.id)
        }

        setBiome(biome) {
            return bot.plot.setBiome(this.id, biome)
        }

        kick(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.kick(this.id, players)
        }
        ban(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.ban(this.id, players)
        }

        add(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.add(this.id, players)
        }
        trust(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.trust(this.id, players)
        }

        remove(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return bot.plot.remove(this.id, players)
        }

        getInfo() {
            return bot.plot.info.get(this.id)
        }
    }

    bot.plot.fromPositionVarying = () => new AbsolutePlot('')

    // bot.plot.fromPositionFixed = () => new AbsolutePlot()

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
