module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    class AbsolutePlot {
        constructor(id) {
            this.id = id
        }

        setAlias(alias) {
            return bot.chat.sendFallible({})
        }
        removeAlias() {
            return bot.chat.sendFallible({})
        }

        setBiome() {
            return bot.chat.sendFallible({})
        }

        kick() {
            return bot.chat.sendFallible({})
        }
        ban() {
            return bot.chat.sendFallible({})
        }

        add() {
            return bot.chat.sendFallible({})
        }
        trust() {
            return bot.chat.sendFallible({})
        }

        remove() {
            return bot.chat.sendFallible({})
        }

        getInfo() {
            return bot.chat.sendFallible({})
        }
    }
}
