// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.disguise)

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