module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    class AbsolutePlot {
        constructor(id) {
            this.id = id
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
            return bot.plot.getInfo(this.id)
        }
    }
}
