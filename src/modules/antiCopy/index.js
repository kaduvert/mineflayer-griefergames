module.exports = function load(bot, ns) {
    const antiCopy = ns['antiCopy'].data

    ns.antiCopy.getProtector = (stack) => {
        if (bot.pattern.item.match(stack, antiCopy.itemPatterns.protectedMap)) {
            return bot.pattern.item.match(stack, antiCopy.itemPatterns.protectedMap)[0][0]
        }
        return null
    }
}
