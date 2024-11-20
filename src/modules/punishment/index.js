module.exports = function load(bot, ns) {
    const punishment = ns['punishment'].data

    ns.punishment.parse = (regexMatches) => {
        const [
            [],
            [target],
            [creator],
            [duration],
            [reasoning]
        ] = regexMatches
        return {
            target,
            creator,
            duration: +duration,
            reasoning
        }
    }

    bot.on('chat:punishment->startKick', (regexMatches) => {
        const startKickData = ns.punishment.parse(regexMatches)
        bot.emit('misc:punishment->startKick', startKickData)
        bot.emit('misc:punishment->startKick:' + startKickData.target, startKickData)
    })

    bot.on('chat:punishment->startJail', (regexMatches) => {
        const startJailData = ns.punishment.parse(regexMatches)
        bot.emit('misc:punishment->startJail', startJailData)
        bot.emit('misc:punishment->startJail:' + startJailData.target, startJailData)
    })
}
