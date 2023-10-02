module.exports = function inject(bot, options) {
    const tpa = bot.hostData['tpa']

    bot.on('chat:tpa->request', ([[username]]) => {
        username = bot.playerUtils.resolveNickname(username)

        bot.emit('misc:tpa->request', username)
        bot.emit('misc:tpa->request:' + username)
    })
}
