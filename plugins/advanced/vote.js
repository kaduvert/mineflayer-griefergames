module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[GrieferGames\] Du kannst keine weiteren Geschenke abholen\.$/, 'noVotePresents')
    bot.chatAddPattern(/^\[GrieferGames\] Du hast deine Geschenke abgeholt\.$/, 'votePresentCollected')

    bot.vote = {}

    bot.vote.collectPresent = () => {
        return bot.chat.getChatActionResult('/geschenk', 'votePresentCollected', ['noVotePresents'], 5000)
    }
}
