// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const antiCopy = bot.ggData.antiCopy
    bot.chat.loadPatterns(bot.ggData.antiCopy)

    bot.antiCopy = {}

    bot.antiCopy.getProtector = (stack) => {
        if (stack.customLore && stack.customLore.length >= 1) {
            return stack.customLore[0].replace(/§./g, '').match(antiCopy.loreRegex)?.[1]
        }
        return null
    }

    bot.antiCopy.addProtection = () => {
        return bot.chat.getChatActionResult(
            antiCopy.commands.toggleProtection,
            'protectionAdded',
            ['notOwnerError', 'protectionRemoved'],
            7500
        )
    }

    bot.antiCopy.removeProtection = () => {
        return bot.chat.getChatActionResult(
            antiCopy.commands.toggleProtection,
            'protectionRemoved',
            ['protectionAdded', 'notOwnerError'],
            7500
        )
    }
}
