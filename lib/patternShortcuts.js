module.exports = function inject(bot, options) {
    bot.getMultiHeadEventIdentifier = (patternHeads, patternIdentifier) => bot.getEventIdentifier(patternHeads.find(head => bot.getEventIdentifier(head, patternIdentifier) !== patternIdentifier), patternIdentifier)

    bot.getEventIdentifier = (patternHead, patternIdentifier) => {
        if (!patternHead) return patternIdentifier
        const hasBaseEvent = patternIdentifier.includes(':')
        const hasCompleteIdentifier = patternIdentifier.includes(bot.patternHeadNameSeparator)
        if (hasCompleteIdentifier) {
            [patternHead, patternIdentifier] = patternIdentifier.split(bot.patternHeadNameSeparator)
        }
        if (hasBaseEvent && hasCompleteIdentifier) return patternHead + bot.patternHeadNameSeparator + patternIdentifier
        if (hasBaseEvent) {
            const [eventName, patternName] = patternIdentifier.split(':')
            return `${eventName}:${hasCompleteIdentifier ? '' : patternHead + bot.patternHeadNameSeparator}${patternName}`
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
