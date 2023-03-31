module.exports = function inject(bot, options) {
    const vote = bot.loadPatternsAndGetData('vote')

    bot.vote = {}

    bot.vote.collectPresent = () => {
        return bot.chat.sendFallible({
            patternHead: 'vote',
            command: 'collectPresent',
            successEvent: 'presentCollected',
            failureEvent: 'noPresents',
            timeout: 5000
        })
    }
}
