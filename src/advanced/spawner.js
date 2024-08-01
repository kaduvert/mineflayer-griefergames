module.exports = function load(bot, ns) {
    const spawner = ns.data['spawner']

    ns.spawner.tryToOpen = (spawnerBlock) => {
        const stackAtQuickbarSlot = bot.inventory.slots[bot.inventory.hotbarStart + bot.quickBarSlot]
        if (stackAtQuickbarSlot) {
            return new Error('holding a stack at the bots selected quickbarSlot will result in timeout. ensure, that the bots hand is empty')
        }
        bot.activateBlock(spawnerBlock)
        return bot.getActionResult({
            patternHead: 'spawner',
            successEvents: ['windowOpen:storage', 'windowOpen:inactive'],
            failureEvents: ['alreadyOpenedError', 'noOpenPermissionsError']
        })
    }

    ns.spawner.getLootableStacks = (window) => {
        return window.containerItems().filter(stack =>
            stack.name !== 'stained_glass_pane' &&
            !bot.pattern.item.match(spawner.itemPatterns.availableExperience, stack) &&
            !bot.pattern.item.match(spawner.itemPatterns.nextUpdate, stack) &&
            !bot.pattern.item.match(spawner.itemPatterns.settings, stack)
        )
    }

    ns.spawner.lootStack = (window, stack) => {
        ns.spawner.listenForIncomingStack(window, stack)
        return bot.window.clickFallible({
            window,
            slotToClick: stack.slot,
            patternHead: 'spawner',
            successEvent: 'misc:stackReceived',
            failureEvent: 'noFreeInventorySpaceError'
        })
    }

    ns.spawner.listenForIncomingStack = (window, stack) => {
        const { type, metadata, count } = stack
        const beginningCount = window.countRange(window.inventoryStart, window.inventoryEnd, type, metadata)
        const onSlotUpdate = (slot) => {
            const updatedCount = window.countRange(window.inventoryStart, window.inventoryEnd, type, metadata)
            if (updatedCount - beginningCount === count) {
                bot.emit('misc:spawner->stackReceived')
                window.off('updateSlot', onSlotUpdate)
            }
        }
        window.on('updateSlot', onSlotUpdate)
        setTimeout(() => (window.off('updateSlot', onSlotUpdate)), 500)
    }
}
