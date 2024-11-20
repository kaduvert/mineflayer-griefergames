module.exports = function load(bot, ns) {
    const privateChat = ns['privateChat'].data

    bot.on('chat:privateChat->receivedMessage', ([[username, message]]) => {
        username = ns.playerUtils.resolveNickname(username)

        bot.emit('misc:privateChat->receivedMessage', username, message)
        bot.emit('misc:privateChat->receivedMessage:' + username, message)
    })

    ns.privateChat.splitSend = (username, message) => {
        const limit = 100 - (username.length + 6) // '/msg ${username} '
        const splits = []
        let lastSplit = 0
        while (lastSplit < message.length) {
            const max = lastSplit + limit
            const part = message.substring(lastSplit, max)
            const splitIndex = (part.length < limit) ? part.length : ((part.lastIndexOf(' ') + 1) || max)
            splits.push(message.substring(lastSplit, (lastSplit + splitIndex)).trim())
            lastSplit = lastSplit + splitIndex
        }
        splits.forEach(split => {
            ns.privateChat.send(username, split)
        })
    }
}
