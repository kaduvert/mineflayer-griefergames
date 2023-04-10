// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const Item = require('prismarine-item')(bot.version)

    bot.window = {}

    bot.window.clickFallible = (options) => {
        const {
            window = bot.currentWindow,
            slotToClick,
            mouseButton = 0,
        } = options

        return new Promise((res) => {
            const updateSlotEvent = 'updateSlot:' + slotToClick
            const itemAtSlot = window.slots[slotToClick]
            const onSlotChange = (oldItem, newItem) => {
                if (oldItem === null && Item.equal(itemAtSlot, newItem)) {
                    res(new bot.ActionResult(bot.actionResultStatus.FAILURE, 'clickRejection', slotToClick)) // TODO: beautify
                }
            }
            bot.on(updateSlotEvent, onSlotChange)

            bot.clickWindow(slotToClick, mouseButton, 0)
            bot.getActionResult(options).then((actionResult) => {
                bot.off(updateSlotEvent, onSlotChange)
                res(actionResult)
            })
        })
    }

    bot.window.loadPatterns = (windowPatterns, hostDataObjName) => {
        if (!windowPatterns) return
        Object.keys(windowPatterns).forEach(windowPatternName => {
            bot.pattern.window.patterns[hostDataObjName + bot.patternHeadNameSeparator + windowPatternName] = windowPatterns[windowPatternName]
        })
    }
}