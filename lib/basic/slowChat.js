module.exports = function inject(bot, options) {
    const slowChat = bot.hostData['slowChat']

    bot.slowChat.active = false

    bot.on('chat:slowChat->activated', () => {
        bot.slowChat.active = true
    })

    bot.on('chat:slowChat->deactivated', () => {
        bot.slowChat.active = false
    })
}
