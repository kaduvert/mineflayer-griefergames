// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^Du bist nun als (\S+) verkleidet\.$/, 'disguised')
	bot.chatAddPattern(/^Du hast deine Verkleidung entfernt\.$/, 'disguiseRemoved')

	bot.chatAddPattern(/^Du bist als bat verkleidet\.$/, 'disguiseStatus')
	bot.chatAddPattern(/^Du bist nicht verkleidet.$/, 'disguiseNotFound')

    // (bat; visibility=everyone; visibility-param=; custom-name=; custom-name-visible)
	// bot.chatAddPattern(/^\((\S+); visibility=everyone; visibility-param=; custom-name=; custom-name-visible\)$/, 'disguiseStatusRaw')

    bot.chatAddPattern(/^Falsche Benutzung: (.+) sind unbekannte Argumente\.$/, 'disguiseUnknownArgumentsError')
    bot.chatAddPattern(/^Du darfst das nicht tun\.$/, 'disguiseInsufficientPermissionsError')
    bot.chatAddPattern(/^Ein anderes Plugin verbietet es dir, diese Aktion auszuführen\.$/, 'disguisePluginForbidsActionError')

	bot.disguise = {
        current: null
    }

    bot.disguise.as = (disguiseIdentifier) => {
        return bot.chat.getChatActionResult(`/d ${disguiseIdentifier}`, 'disguised', ['disguiseUnknownArgumentsError', 'disguiseInsufficientPermissionsError', 'disguisePluginForbidsActionError'], 5000)
    }

    bot.disguise.remove = () => {
        return bot.chat.getChatActionResult('/ud', 'disguiseRemoved', ['disguiseNotFound'], 5000)
    }

    bot.disguise.status = () => {
        return bot.chat.getChatActionResult('/d status', ['disguiseStatus', 'disguiseNotFound'], [], 5000)
    }

    bot.on('disguised', (disguiseIdentifier) => {
        bot.disguise.current = disguiseIdentifier
    })
}