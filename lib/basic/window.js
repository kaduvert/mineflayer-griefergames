// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)
    const Item = require('prismarine-item')(bot.version)

    bot.window = {
        patterns: {}
    }

    bot.window.clickFallible = (options) => {
        const {
            window = bot.currentWindow,
            slot,
            mouseButton = 0,
            patternHeads = [],
            patternHead,
            currentWindowPatternName
        } = options

        if (patternHead !== undefined) { // TODO: remove this redundant code
            patternHeads.push(patternHead)
            delete options.patternHead
        }

        if (currentWindowPatternName) {
            const currentWindowPattern = patternHeads.find(head => bot.apiData[head]?.windowPatterns?.[currentWindowPatternName])
            const currentWindowTitle = bot.window.getTranslatedWindowTitle(window)
            if (!currentWindowPattern.match(currentWindowTitle)) {
                throw new Error(`window title assertion failed. the currentWindowTitle (${currentWindowTitle}) must match ${currentWindowPattern}`)
            }
        }

        return new Promise((res) => {
            if (bot.currentWindow !== window) {
                throw new Error('the provided window is not the currentWindow, it has probably been closed prematurely')
            }
            const updateSlotEvent = 'updateSlot:' + slot
            const itemAtSlot = window.slots[slot]
            const onSlotChange = (oldItem, newItem) => {
                if (oldItem === null && Item.equal(itemAtSlot, newItem)) {
                    res(new bot.ActionResult(bot.actionResultStatus.FAILURE, 'clickRejection', slot)) // TODO: beautify
                }
            }
            bot.on(updateSlotEvent, onSlotChange)

            bot.clickWindow(slot, mouseButton, 0)
            bot.getActionResult(options).then((actionResult) => {
                bot.off(updateSlotEvent, onSlotChange)
                res(actionResult)
            })
        })
    }

    bot.window.loadPatterns = (apiDataObj, patternHead) => {
        const windowPatterns = apiDataObj.windowPatterns
        if (!windowPatterns) return
        Object.keys(windowPatterns).forEach(windowPatternName => {
            bot.window.patterns[patternHead + bot.patternHeadNameSeparator + windowPatternName] = windowPatterns[windowPatternName]
        })
    }

    bot.window.getTranslatedWindowTitle = (window) => ChatMessage.fromNotch(window.title).toString()

    bot.on('windowOpen', (window) => {
        const title = bot.window.getTranslatedWindowTitle(window)
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
