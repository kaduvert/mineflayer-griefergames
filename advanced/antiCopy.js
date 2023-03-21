// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const antiCopy = bot.loadPatternsAndGetData('antiCopy')

    bot.antiCopy = {}

    bot.antiCopy.getProtector = (stack) => {
        if (bot.window.matchesItemPattern('antiCopy', 'protectedMap', stack)) {
            return bot.window.getItemPatternMatches('antiCopy', 'protectedMap', stack)[0][0]
        }
        return null
    }

    bot.antiCopy.addProtection = () => {
        return bot.chat.getChatActionResult(
            'antiCopy',
            'toggleProtection',
            'protectionAdded',
            ['notOwnerError', 'protectionRemoved'],
            7500
        )
    }

    bot.antiCopy.removeProtection = () => {
        return bot.chat.getChatActionResult(
            'antiCopy',
            'toggleProtection',
            'protectionRemoved',
            ['protectionAdded', 'notOwnerError'],
            7500
        )
    }
}
