module.exports = function inject(bot, options) {
    const money = bot.hostData['money']

    bot.on('chat:money->received', ([[name, amount]]) => {
        name = bot.playerUtils.resolveNickname(name)
        amount = +amount.replace(/,/g, '')

        const scoreboardBalance = bot.serverInfo.getNumericBalance()
        setTimeout(() => {
            const newScoreboardBalance = bot.serverInfo.getNumericBalance()

            if (newScoreboardBalance - scoreboardBalance >= amount) {
                bot.emit('misc:money->received', (name, amount))
                bot.emit('misc:money->received:' +name, amount)
            }
        }, 100)
    })
}
