module.exports = function inject(bot, options) {
    const privateChat = bot.hostData['privateChat']

    bot.on('chat:privateChat->receivedMessage', ([[username, message]]) => {
        username = bot.playerUtils.resolveNickname(username)

        bot.emit('misc:privateChat->receivedMessage', username, message)
        bot.emit('misc:privateChat->receivedMessage:' + username, message)
    })
}
