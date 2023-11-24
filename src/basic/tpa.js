module.exports = function load(bot, ns) {
    const tpa = ns.data['tpa']

    bot.on('chat:tpa->request', ([[username]]) => {
        username = ns.playerUtils.resolveNickname(username)

        bot.emit('misc:tpa->request', username)
        bot.emit('misc:tpa->request:' + username)
    })
}
