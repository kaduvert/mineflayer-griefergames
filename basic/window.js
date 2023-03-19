// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)
    const Item = require('prismarine-item')(bot.version)

    bot.chatAddPattern(/^$/, '')

    bot.window = {
        patterns: {}
    }

    bot.window.loadPatterns = (ggDataObj) => {
        const windowPatterns = ggDataObj.windowPatterns
        Object.keys(windowPatterns).forEach(windowPatternName => {
            bot.window.patterns[windowPatternName] = windowPatterns[windowPatternName]
        })
    }

    bot.window.getClickActionResult = (window, slot, mouseButton, ...args) => {
        return new Promise((res) => {
            if (bot.currentWindow !== window) {
                res({
                    status: bot.actionResultStatus.FAILURE,
                    event: 'windowClose',
                    eventArgs: window
                })
                return
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
            bot.getActionResult(...args).then((actionResult) => {
                bot.off(updateSlotEvent, onSlotChange)
                res(actionResult)
            })
        })
    }

    bot.window.matchesItemPattern = (stack, { title: titleRegex, lore: loreRegex }) => {
        const stackName = stack.customName
        const stackLore = stack.customLore
        let isMatching = true
        if (stackName) {
            isMatching = titleRegex.test(stackName.replace(/§./g, ''))
        }
        if (stackLore) {
            for (let i = 0; i < stackLore.length; i++) {
                isMatching = loreRegex[i] ? loreRegex[i].test(stackLore[i].replace(/§./g, '')) : true
            }
        }
        return isMatching
    }

    bot.window.getItemPatternMatches = (stack, { title: titleRegex, lore: loreRegex }) => {
        const matches = {
            titleMatch: null,
            loreMatches: null
        }
        if (titleRegex) {
            matches.titleMatch = stack.customName.replace(/§./g, '').match(titleRegex).splice(1)
        }
        if (loreRegex) {
            for (let i = 0; i < loreRegex.length; i++) {
                matches.loreMatches[i] = stack.customLore.replace(/§./g, '').match(loreRegex[i]).splice(1)
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
