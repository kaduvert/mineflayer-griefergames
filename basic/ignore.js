module.exports = function inject(bot, options) {
	const ignore = bot.ggData.ignore
	bot.chat.loadPatterns(ignore)

	bot.ignore = {}

	bot.privateChat.toggle = (username) => {
        return bot.chat.getChatActionResult(
            bot.buildCommand(ignore.commands.target, username),
            ['add', 'remove'],
            [],
            5000
        )
    }
    
    bot.privateChat.getIgnoredList = () => {
        return bot.chat.getChatActionResult(
            ignore.commands.list,
            ['list', 'listEmpty'],
            [],
            5000
        )
    }
}