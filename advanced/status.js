// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.status)

	bot.status = {}

    bot.status.set = (message) => {
        return bot.chat.getChatActionResult(`/status ${message}`, 'statusMessageSet', ['statusInsufficientPermissionsError'], 5000)
    }

    bot.status.toggle = () => {
        return bot.chat.getChatActionResult('/status toggle', ['statusActivated', 'statusDeactivated'], ['statusInsufficientPermissionsError'], 5000)
    }
}