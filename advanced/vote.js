module.exports = function inject(bot, options) {
    const vote = bot.ggData.vote
    bot.loadChatPatterns(vote)

    bot.vote = {}

    bot.vote.collectPresent = () => {
        return bot.chat.getChatActionResult(
            vote.commands.collectPresent,
            'chat:votePresentCollected',
            ['chat:noVotePresents'],
            5000
        )
    }
}
