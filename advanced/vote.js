module.exports = function inject(bot, options) {
    const vote = bot.ggData.vote
    bot.chat.loadPatterns(vote)

    bot.vote = {}

    bot.vote.collectPresent = () => {
        return bot.chat.getChatActionResult(
            vote.commands.collectPresent,
            'presentCollected',
            ['noPresents'],
            5000
        )
    }
}
