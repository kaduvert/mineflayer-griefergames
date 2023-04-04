module.exports = function inject(bot, options) {
    bot.getMultiHeadEventIdentifier = (patternHeads, patternIdentifier) => bot.getEventIdentifier(patternHeads.find(head => bot.getEventIdentifier(head, patternIdentifier) !== patternIdentifier), patternIdentifier)

    bot.getEventIdentifier = (patternHead, patternIdentifier) => {
        if (!patternHead) return patternIdentifier
        const baseEvent = eventName.contains(':')
        if (baseEvent) {
            const [eventName, patternName] = patternIdentifier.split(':')
            return `${eventName}:${patternHead}${bot.patternHeadNameSeparator}${patternName}`
        } else {
            const chatPattern = bot.getPattern('chat', patternHead, patternIdentifier)
            if (chatPattern) {
                return `chat:${patternHead}${bot.patternHeadNameSeparator}${patternIdentifier}`
            } else {
                return patternIdentifier
            }
        }
    }

    bot.getPattern = (type, head, identifier) => bot.hostData[head][type + 'Patterns'][identifier]

    bot.getCommandTemplate = (head, identifier) => bot.hostData[head].commands?.[identifier]
}
