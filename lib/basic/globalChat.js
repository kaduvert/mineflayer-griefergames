module.exports = function inject(bot, options) {
    const globalChat = bot.hostData['globalChat']

    bot.on('chat:globalChat->message', ([[cb, rank, username, message]]) => {
        if (username === bot.username) {
            bot.emit('misc:globalChat->sentMessage', cb, rank, username, message)
        }
    })
}
