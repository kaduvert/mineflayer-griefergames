// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const disguise = bot.ggData.disguise
    bot.loadChatPatterns(disguise)

	bot.disguise = {
        current: null
    }

    bot.disguise.as = (disguiseIdentifier) => {
        return bot.chat.getChatActionResult(disguise.commands.as(disguiseIdentifier),'chat:disguised',
        ['chat:disguiseUnknownArgumentsError', 'chat:disguiseInsufficientPermissionsError', 'chat:disguisePluginForbidsActionError'], 5000)
    }

    bot.disguise.remove = () => {
        return bot.chat.getChatActionResult(disguise.commands.remove(), 'chat:disguiseRemoved', ['chat:disguiseNotFound'], 5000)
    }

    bot.disguise.getStatus = () => {
        return bot.chat.getChatActionResult(disguise.commands.getStatus(), ['chat:disguiseStatus', 'chat:disguiseNotFound'], [], 5000)
    }

    bot.on('chat:disguised', (disguiseIdentifier) => {
        bot.disguise.current = disguiseIdentifier
    })
}
