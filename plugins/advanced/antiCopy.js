// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[AntiCopy\] Deine Karte ist nun geschützt\.$/, 'mapAntiCopyProtectionAdded')
	bot.chatAddPattern(/^\[AntiCopy\] Der Schutz deiner Karte wurde entfernt\.$/, 'mapAntiCopyProtectionRemoved')

	bot.chatAddPattern(/^\[AntiCopy\] Du kannst nur den Schutz deiner Karten ausschalten\.$/, 'mapAntiCopyNotOwnerError')
	bot.chatAddPattern(/^\[AntiCopy\] Du kannst diesen Befehl nur alle (\d+) Sekunden ausführen\.$/, 'spamWarning')

    const antiCopyLoreRegex = /^Ersteller der Karte: (\S+)$/

    bot.antiCopy = {}

    bot.antiCopy.getProtector = (stack) => {
        if (stack.customLore && stack.customLore.length >= 1) {
            return stack.customLore[0].replace(/§./g, '').match(antiCopyLoreRegex)?.[1]
        }
        return null
    }

    bot.antiCopy.addProtection = () => {
        return bot.chat.getChatActionResult('/anticopy', 'mapAntiCopyProtectionAdded', ['mapAntiCopyNotOwnerError', 'mapAntiCopyProtectionRemoved'], 7500)
    }

    bot.antiCopy.removeProtection = () => {
        return bot.chat.getChatActionResult('/anticopy', 'mapAntiCopyProtectionRemoved', ['mapAntiCopyProtectionAdded', 'mapAntiCopyNotOwnerError'], 7500)
    }

}
