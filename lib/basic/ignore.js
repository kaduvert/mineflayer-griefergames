module.exports = function inject(bot, options) {
    const ignore = bot.loadPatternsAndGetData('ignore')

    bot.ignore = {}

    bot.privateChat.toggle = (username) => {
        return bot.chat.sendFallible({
            patternHead: 'ignore',
            command: ['target', username],
            successEvents: ['add', 'remove'],
            timeout: 5000
        })
    }

    bot.privateChat.getIgnoredList = () => {
        return bot.chat.sendFallible({
            patternHead: 'ignore',
            command: 'list',
            successEvent: ['list', 'listEmpty'],
            timeout: 5000
        })
    }
}