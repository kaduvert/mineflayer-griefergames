// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^\[Status\] Du hast '(.+)' als Status gesetzt\.$/, 'statusMessageSet')
	bot.chatAddPattern(/^\[Status\] Du hast den Status beim Joinen aktiviert\.$/, 'statusActivated')
	bot.chatAddPattern(/^\[Status\] Du hast den Status beim Joinen deaktiviert\.$/, 'statusDeactivated')

	bot.chatAddPattern(/^\[Status\] Du hast keinen (.+)-Rang\. Besuche unseren Shop unter (.+)!$/, 'statusInsufficientPermissionsError')

	bot.status = {}

    bot.status.set = (message) => {
        return bot.chat.getChatActionResult(`/status ${message}`, 'statusMessageSet', ['statusInsufficientPermissionsError'], 5000)
    }

    bot.status.toggle = () => {
        return bot.chat.getChatActionResult('/status toggle', ['statusActivated', 'statusDeactivated'], ['statusInsufficientPermissionsError'], 5000)
    }
}