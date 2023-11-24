module.exports = function load(bot, ns) {
    const privateChat = ns.data['privateChat']

    bot.on('chat:privateChat->receivedMessage', ([[username, message]]) => {
        username = ns.playerUtils.resolveNickname(username)

        bot.emit('misc:privateChat->receivedMessage', username, message)
        bot.emit('misc:privateChat->receivedMessage:' + username, message)
    })
}
