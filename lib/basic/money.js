module.exports = function inject(bot, options) {
    const money = bot.hostData['money']

    bot.money.prev = 0
    bot.money.log = []

    bot.money.toNumberChat = (balStr) => +balStr.replace(/,/g, '')
    bot.money.toNumberScoreboard = (balStr) => +(balStr.substring(0, balStr.length - 1).replace(/\./g, '').replace(/,/g, '.'))

    bot.on('teamUpdated', team => {
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
    })

    bot.on('chat:money->received', ([[name, amount]]) => {
        name = bot.playerUtils.resolveNickname(name)
        amount = bot.money.toNumberChat(amount)

        const relevantLog = bot.money.log.find(entry => (Date.now() - entry.time < 3000) && (amount === entry.difference) && !entry.used)
        if (relevantLog) {
            bot.emit('misc:money->received', name, amount)
            bot.emit('misc:money->received:' + name, amount)
            relevantLog.used = true
        }
    })
}
