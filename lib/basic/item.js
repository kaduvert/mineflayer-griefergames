module.exports = function inject(bot, options) {

    bot.item = {}

    bot.item.resolvePattern = (head, identifier) => bot.apiData[head].itemPatterns[identifier]

    bot.item.matchesPattern = (patternHead, patternName, stack) => {
        const { title: titleRegex, lore: loreRegex } = bot.item.resolvePattern(patternHead, patternName)
        const stackName = stack.customName
        const stackLore = stack.customLore
        let matchesName = true
        if (titleRegex) {
            matchesName = stackName ? titleRegex.test(stackName.replace(/§./g, '')) : false
        }
        let matchesLore = true
        if (loreRegex?.length) {
            if (stackLore?.length) {
                for (let i = 0; i < loreRegex.length; i++) {
                    matchesLore = stackLore[i] ? loreRegex[i].test(stackLore[i].replace(/§./g, '')) : false
                    if (!matchesLore) break
                }
            } else {
                matchesLore = false
            }
        }
        return matchesName && matchesLore
    }

    bot.item.getPatternMatches = (patternHead, patternName, stack) => {
        const { title: titleRegex, lore: loreRegex } = bot.item.resolvePattern(patternHead, patternName)
        const stackName = stack.customName
        const stackLore = stack.customLore
        const matches = {
            titleMatch: null,
            loreMatches: null
        }
        if (titleRegex && stackName) {
            matches.titleMatch = stackName.replace(/§./g, '').match(titleRegex).splice(1)
        }
        if (loreRegex) {
            matches.loreMatches = []
            for (let i = 0; i < loreRegex.length; i++) {
                matches.loreMatches[i] = stackLore.replace(/§./g, '').match(loreRegex[i]).splice(1)
            }
        }
        return matches
    }

    bot.item.findMatchingIn = (window, patternHead, patternName) => {
        const pattern = bot.item.resolvePattern(patternHead, patternName)
        return window.slots.find(e => bot.item.matchesPattern(e, pattern))
    }
}