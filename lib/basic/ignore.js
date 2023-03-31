module.exports = function inject(bot, options) {
    const ignore = bot.loadPatternsAndGetData('ignore')

    bot.ignore = {}

    bot.privateChat.toggle = (username) => {
        return bot.chat.sendFallibe(
            'ignore',
            ['target', username],
            ['add', 'remove'],
            [],
            5000
        )
    }

    bot.privateChat.getIgnoredList = () => {
        return bot.chat.sendFallibe(
            'ignore',
            'list'
            ['list', 'listEmpty'],
            [],
            5000
        )
    }
}