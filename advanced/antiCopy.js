// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.antiCopy)

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
