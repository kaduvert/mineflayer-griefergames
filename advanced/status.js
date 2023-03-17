// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const status = bot.ggData.status
    bot.loadChatPatterns(status)

	bot.status = {}

    bot.status.set = (message) => {
        return bot.chat.getChatActionResult(status.commands.set(message), 'statusMessageSet', ['statusInsufficientPermissionsError'], 5000)
    }

    bot.status.toggle = () => {
        return bot.chat.getChatActionResult(status.commands.toggle(), ['statusActivated', 'statusDeactivated'], ['statusInsufficientPermissionsError'], 5000)
    }
}