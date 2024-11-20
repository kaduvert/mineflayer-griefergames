module.exports = function load(bot, ns) {
    const plot = ns['plot'].data

    class AbsolutePlot {
        constructor(id) {
            if (typeof id === 'string' && id.includes(plot.info.idSeparator)) {
                this.id = ns.plot.info.parseId(id)
            } else {
                this.id = id
            }
        }

        get idString() {
            return this.id.join(plot.info.idSeparator)
        }

        setAlias(alias) {
            return ns.plot.setAlias(this.idString, alias)
        }
        removeAlias() {
            return ns.plot.removeAlias(this.idString)
        }

        setBiome(biome) {
            return ns.plot.setBiome(this.idString, biome)
        }

        kick(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return ns.plot.kick(this.idString, players)
        }
        ban(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return ns.plot.ban(this.idString, players)
        }

        add(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return ns.plot.add(this.idString, players)
        }
        trust(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return ns.plot.trust(this.idString, players)
        }

        remove(players) {
            if (players instanceof Array) {
                players = players.join(',')
            }
            return ns.plot.remove(this.idString, players)
        }

        async getInfo() {
            const info = await ns.plot.info.get(this.idString)

            // assign the plot info to this
            for (const key of Object.keys(info)) {
                if (key === 'id') continue
                this[key] = info[key]
            }

            return info
        }

        setFlag(flag, value) {
            return ns.plot.setFlag(this.idString, flag, ns.plot.info.serializeFlagValue(value))
        }
    }

    ns.plot.fromPositionVarying = () => new AbsolutePlot([])

    ns.plot.fromPositionFixed = () => new AbsolutePlot(ns.plot.coordination.positionToId())

    ns.plot.fromId = (id) => new AbsolutePlot(id)
}
