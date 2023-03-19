const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const punishment = bot.ggData.punishment
    bot.chat.loadPatterns(punishment)

    bot.punishment = {
        events: new EventEmitter()
    }

    bot.punishment.parse = (regexMatches) => {
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

    bot.punishment.vote = (opinion) => {
        return bot.chat.getChatActionResult(
            opinion ? punishment.commands.voteYes : punishment.commands.voteNo,
            'chat:punishmentVote',
            ['chat:punishmentChangeOpinionError'],
            5000
        )
    }

    bot.on('chat:startKick', (regexMatches) => {
        const startKickData = bot.punishment.parse(matches)
        bot.punishment.events.emit('startKick', startKickData)
        bot.punishment.events.emit('startKick:' + startKickData.target, startKickData)
    })

    bot.on('chat:startJail', (regexMatches) => {
        const startJailData = bot.punishment.parse(matches)
        bot.punishment.events.emit('startJail', startJailData)
        bot.punishment.events.emit('startJail:' + startJailData.target, startJailData)
    })
}
