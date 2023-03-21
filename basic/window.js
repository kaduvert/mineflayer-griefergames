// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)
    const Item = require('prismarine-item')(bot.version)

    bot.window = {
        patterns: {}
    }

    bot.window.loadPatterns = (ggDataObj, patternHead) => {
        const windowPatterns = ggDataObj.windowPatterns
        if (!windowPatterns) return
        Object.keys(windowPatterns).forEach(windowPatternName => {
            bot.window.patterns[patternHead + bot.ggData.patternHeadNameSeparator + windowPatternName] = windowPatterns[windowPatternName]
        })
    }

    bot.window.getClickActionResult = (window, slot, mouseButton, patternResolver, ...args) => {
        return new Promise((res) => {
            if (bot.currentWindow !== window) {
                throw new Error('the provided window is not the currentWindow, it has probably been closed prematurely')
            }
            const updateSlotEvent = 'updateSlot:' + slot
            const itemAtSlot = window.slots[slot]
            const onSlotChange = (oldItem, newItem) => {
                if (oldItem === null && Item.equal(itemAtSlot, newItem)) {
                    res({
                        status: bot.actionResultStatus.FAILURE,
                        event: 'clickRejection'
                    })
                }
            }
            bot.on(updateSlotEvent, onSlotChange)

            bot.clickWindow(slot, mouseButton, 0)
            bot.getActionResult(patternResolver, ...args).then((actionResult) => {
                bot.off(updateSlotEvent, onSlotChange)
                res(actionResult)
            })
        })
    }

    bot.window.matchesItemPattern = (patternResolver, patternName, stack) => {
        const { title: titleRegex, lore: loreRegex } = bot.resolveItemPattern(patternResolver, patternName)
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

    bot.window.getItemPatternMatches = (patternResolver, patternName, stack) => {
        const { title: titleRegex, lore: loreRegex } = bot.resolveItemPattern(patternResolver, patternName)
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

    bot.window.getMatchingItem = (window, pattern) => window.slots.find(e => bot.window.matchesItemPattern(e, pattern)),

        bot.on('windowOpen', (window) => {
            const title = ChatMessage.fromNotch(window.title).toString()
            const windowPatterns = bot.window.patterns
            Object.keys(windowPatterns).forEach(windowPatternName => {
                const windowPattern = windowPatterns[windowPatternName]

                const windowTitleMatch = title.match(windowPattern)
                if (windowTitleMatch) {
                    bot.emit('windowOpen:' + windowPatternName, window, windowTitleMatch.splice(1))
                }
            })
        })
}
