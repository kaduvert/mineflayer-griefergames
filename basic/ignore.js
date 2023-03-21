module.exports = function inject(bot, options) {
    const ignore = bot.ggData.loadPatternsAndGetData('ignore')

    bot.ignore = {}

    bot.privateChat.toggle = (username) => {
        return bot.chat.getChatActionResult(
            'ignore',
            ['target', username],
            ['add', 'remove'],
            [],
            5000
        )
    }

    bot.privateChat.getIgnoredList = () => {
        return bot.chat.getChatActionResult(
            'ignore',
            'list'
            ['list', 'listEmpty'],
            [],
            5000
        )
    }
}