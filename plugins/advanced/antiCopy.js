// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[AntiCopy\] Deine Karte ist nun geschützt\.$/, 'mapAntiCopyProtectionAdded')
	bot.chatAddPattern(/^\[AntiCopy\] Der Schutz deiner Karte wurde entfernt\.$/, 'mapAntiCopyProtectionRemoved')

	bot.chatAddPattern(/^\[AntiCopy\] Du kannst nur den Schutz deiner Karten ausschalten\.$/, 'mapAntiCopyNotOwnerError')
	bot.chatAddPattern(/^\[AntiCopy\] Du kannst diesen Befehl nur alle (\d+) Sekunden ausführen\.$/, 'spamWarning')

	bot. = {}

	return bot.chat.getChatActionResult(''``, '', [], 5000)

}
