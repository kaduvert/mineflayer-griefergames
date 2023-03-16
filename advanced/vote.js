module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.vote)

    bot.vote = {}

    bot.vote.collectPresent = () => {
        return bot.chat.getChatActionResult('/geschenk', 'votePresentCollected', ['noVotePresents'], 5000)
    }
}
