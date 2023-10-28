module.exports = function inject(bot, options) {
    const money = bot.hostData['money']

    bot.money.prev = 0
    bot.money.log = []

    const oldTransfer = bot.money.transfer
    bot.money.transfer = (username, amount) => oldTransfer(username, (amount === 0 ? 0.001 : amount))

    bot.money.toNumberChat = (balStr) => +balStr.replace(/,/g, '')
    bot.money.toNumberScoreboard = (balStr) => +(balStr.substring(0, balStr.length - 1).replace(/\./g, '').replace(/,/g, '.'))

    let currentlyListening = false

    const onTeamUpdated = team => {
        if (team?.team === 'money_value' && team?.prefix?.text) {
            const moneyInt = bot.money.toNumberScoreboard(team.prefix.text)

            if (moneyInt !== bot.money.prev) {
                bot.money.log.push({
                    time: Date.now(),
                    difference: moneyInt - bot.money.prev,
                    used: false
                })

                while (bot.money.log.length > 10) bot.money.log.shift()

                bot.money.prev = moneyInt
            }
        }
    }

    bot.on('misc:serverInfo->join', () => {
        if (bot.serverInfo.isOnCitybuild()) {
            bot.money.prev = bot.serverInfo.getNumericBalance()
            if (!currentlyListening) {
                bot.on('teamUpdated', onTeamUpdated)
                currentlyListening = true
            }
        } else {
            if (currentlyListening) {
                bot.off('teamUpdated', onTeamUpdated)
                currentlyListening = false
            }
        }
    })

    bot.on('chat:money->received', ([[name, amount]]) => {
        name = bot.playerUtils.resolveNickname(name)
        amount = bot.money.toNumberChat(amount)

        const relevantLog = bot.money.log.find(entry => (Date.now() - entry.time < 3000) && (amount === entry.difference) && !entry.used)
        if (relevantLog) {
            bot.emit('misc:money->received', name, amount)
            bot.emit('misc:money->received:' + name, amount)
            relevantLog.used = true
        } else if (amount === 0) {
            bot.emit('misc:money->received', name, amount)
            bot.emit('misc:money->received:' + name, amount)
        }
    })
}
