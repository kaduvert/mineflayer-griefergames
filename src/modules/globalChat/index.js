module.exports = function load(bot, ns) {
    const globalChat = ns['globalChat'].data

    bot.on('chat:globalChat->message', ([[cb, rank, username, message]]) => {
        if (username === bot.username) {
            bot.emit('misc:globalChat->sentMessage', cb, rank, username, message)
        }
    })
}
