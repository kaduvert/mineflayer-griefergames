module.exports = function load(bot, ns) {
    const tpa = ns['tpa'].data

    bot.on('chat:tpa->request', ([[username]]) => {
        username = ns.playerUtils.resolveNickname(username)

        bot.emit('misc:tpa->request', username)
        bot.emit('misc:tpa->request:' + username)
    })
}
