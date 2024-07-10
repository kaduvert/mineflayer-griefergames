// const EventEmitter = require('events')

module.exports = function load(bot, ns) {
    const Item = require('prismarine-item')(bot.version)

    bot.window = {}

    bot.window.clickFallible = (options) => {
        const {
            window = bot.currentWindow,
            slotToClick,
            mouseButton = 0,
            successEvent,
            successEvents
        } = options

        return new Promise((res) => {
            const updateSlotEvent = 'updateSlot:' + slotToClick
            const itemAtSlot = window.slots[slotToClick]
            const onSlotChange = (...args) => {
                const { oldItem, newItem } = args
                if (!successEvents?.length && !successEvent) {
                    res(new bot.ActionResult(bot.actionResultStatus.SUCCESS, 'slotUpdate', args))
                }
                if (oldItem === null && Item.equal(itemAtSlot, newItem)) {
                    res(new bot.ActionResult(bot.actionResultStatus.FAILURE, 'clickRejection', slotToClick)) // TODO: beautify
                }
            }
            window.on(updateSlotEvent, onSlotChange)

            bot.clickWindow(slotToClick, mouseButton, 0)
            bot.getActionResult(options).then((actionResult) => {
                window.off(updateSlotEvent, onSlotChange)
                res(actionResult)
            })
        })
    }

    bot.window.loadPatterns = (hostData, hostDataKey) => {
        if (!hostData.windows) return
        Object.keys(hostData.windows).forEach(windowKey => {
            bot.pattern.window.patterns[hostDataKey + bot.patternHeadNameSeparator + windowKey] = hostData.windows[windowKey].titlePattern
        })
    }
}
