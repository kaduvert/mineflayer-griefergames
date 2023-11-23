module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    class AbsolutePlot {
        constructor(id) {
            if (typeof id === 'string' && id.includes(plot.info.idSeparator)) {
                this.id = bot.plot.info.parseId(id)
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

        async getInfo() {
            const info = await bot.plot.info.get(this.idString)

            // assign the plot info to this
            for (const key of Object.keys(info)) {
                if (key === 'id') continue
                this[key] = info[key]
            }

            return info
        }

        setFlag(flag, value) {
            return bot.plot.setFlag(this.idString, flag, bot.plot.info.serializeFlagValue(value))
        }
    }

    bot.plot.fromPositionVarying = () => new AbsolutePlot([])

    bot.plot.fromPositionFixed = () => new AbsolutePlot(bot.plot.coordination.positionToId())

    bot.plot.fromId = (id) => new AbsolutePlot(id)
}
