module.exports = function inject(bot, options) {
    const money = bot.hostData['money']

    const recentlyJoinedSupremes = {}

    bot.on('playerJoined', ({ username }) => {
        // check for sub-supreme rank
        if (!['Spieler', 'Premium', 'Ultra', 'Legende', 'Griefer'].includes(bot.playerUtils.getRank(username))) {
            recentlyJoinedSupremes[username] = Date.now()
            setTimeout(() => {
                recentlyJoinedSupremes[username] = undefined
            }, 1100 + bot.player.ping)
        }
    })

    bot.on('chat:money->received', ([[name, amount]]) => {
        name = bot.playerUtils.resolveNickname(name)
        amount = +amount.replace(/,/g, '')

        if (recentlyJoinedSupremes[name] && ((Date.now() - recentlyJoinedSupremes[name]) < (55 + bot.player.ping))) {
            // assume fake payment
            return
        }

        bot.emit('misc:money->received', (name, amount))
        bot.emit('misc:money->received:' +name, amount)
    })


}
