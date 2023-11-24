module.exports = function load(bot, ns) {
    const disguise = ns.data['disguise']

    ns.disguise.current = null

    bot.on('chat:disguise->disguised', ([[disguiseIdentifier]]) => {
        ns.disguise.current = disguiseIdentifier
    })
}
