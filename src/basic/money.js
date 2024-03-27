module.exports = function load(bot, ns) {
    const money = ns.data['money']

    ns.money.prev = 0
    ns.money.log = []

    ns.money.toNumberChat = (balStr) => +balStr.replace(/,/g, '')
    ns.money.toNumberScoreboard = (balStr) => +(balStr.substring(0, balStr.length - 1).replace(/\./g, '').replace(/,/g, '.'))

    let currentlyListening = false

    const onTeamUpdated = team => {
        if (team?.team === 'money_value' && team?.prefix?.text) {
            const moneyInt = ns.money.toNumberScoreboard(team.prefix.text)

            if (moneyInt !== ns.money.prev) {
                ns.money.log.push({
                    time: Date.now(),
                    difference: moneyInt - ns.money.prev,
                    used: false
                })

                while (ns.money.log.length > 10) ns.money.log.shift()

                ns.money.prev = moneyInt
            }
        }
    }

    bot.on('misc:serverInfo->join', () => {
        if (ns.serverInfo.isOnCitybuild()) {
            ns.money.prev = ns.serverInfo.getNumericBalance()
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
        name = ns.playerUtils.resolveNickname(name)
        amount = ns.money.toNumberChat(amount)

        const relevantLog = ns.money.log.find(entry => (Date.now() - entry.time < 3000) && (amount === entry.difference) && !entry.used)
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
