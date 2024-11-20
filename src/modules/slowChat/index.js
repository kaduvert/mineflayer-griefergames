module.exports = function load(bot, ns) {
    const slowChat = ns['slowChat'].data

    ns.slowChat.active = false

    bot.on('chat:slowChat->activated', () => {
        ns.slowChat.active = true
    })

    bot.on('chat:slowChat->deactivated', () => {
        ns.slowChat.active = false
    })
}
