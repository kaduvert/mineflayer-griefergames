// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const disguise = bot.ggData.disguise
    bot.loadChatPatterns(disguise)

	bot.disguise = {
        current: null
    }

    bot.disguise.as = (disguiseIdentifier) => {
        return bot.chat.getChatActionResult(disguise.commands.as(disguiseIdentifier), 'disguised', ['disguiseUnknownArgumentsError', 'disguiseInsufficientPermissionsError', 'disguisePluginForbidsActionError'], 5000)
    }

    bot.disguise.remove = () => {
        return bot.chat.getChatActionResult(disguise.commands.remove(), 'disguiseRemoved', ['disguiseNotFound'], 5000)
    }

    bot.disguise.getStatus = () => {
        return bot.chat.getChatActionResult(disguise.commands.getStatus(), ['disguiseStatus', 'disguiseNotFound'], [], 5000)
    }

    bot.on('disguised', (disguiseIdentifier) => {
        bot.disguise.current = disguiseIdentifier
    })
}
