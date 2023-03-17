module.exports = function inject(bot, options) {
    const punishment = bot.ggData.punishment
    bot.loadChatPatterns(punishment)

	bot.punishment = {}

	bot.punishment.parse = (regexMatches) => {
        const [target, creator, duration, reasoning] = regexMatches
        return {
            target,
            creator,
            duration: +duration,
            reasoning
        }
    }
}
