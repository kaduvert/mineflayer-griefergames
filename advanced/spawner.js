const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const spawner = bot.loadPatternsAndGetData('spawner')

    bot.spawner = {
        events: new EventEmitter()
    }

    bot.spawner.tryToOpen = (spawnerBlock) => {
        const stackAtQuickbarSlot = bot.inventory.slots[bot.inventory.hotbarStart + bot.quickBarSlot]
        if (stackAtQuickbarSlot) {
            throw new Error('holding a stack at the bots selected quickbarSlot will result in timeout. ensure, that the bots hand is empty')
        }
        bot.activateBlock(spawnerBlock)
        return bot.getActionResult(
            'spawner',
            ['storage', 'inactive'],
            ['alreadyOpenedError', 'noOpenPermissionsError'],
            1000
        )
    }

    bot.spawner.getLootableStacks = (window) => {
        return window.containerItems().filter(stack =>
            stack.name !== 'stained_glass_pane' &&
            !bot.window.matchesItemPattern('spawner', 'availableExperience', stack) &&
            !bot.window.matchesItemPattern('spawner', 'nextUpdate', stack) &&
            !bot.window.matchesItemPattern('spawner', 'settings', stack)
        )
    }

    bot.spawner.lootStack = (window, stack) => {
        bot.spawner.listenForIncomingStack(window, stack)
        return bot.window.getClickActionResult(
            window,
            stack.slot,
            0,
            'spawner',
            'stackReceived',
            ['noFreeInventorySpaceError'],
            1000,
            bot.spawner.events
        )
    }

    bot.spawner.listenForIncomingStack = (window, stack) => {
        const { type, metadata, count } = stack
        const beginningCount = window.countRange(window.inventoryStart, window.inventoryEnd, type, metadata)
        const onSlotUpdate = (slot) => {
            const updatedCount = window.countRange(window.inventoryStart, window.inventoryEnd, type, metadata)
            if (updatedCount - beginningCount === count) {
                bot.spawner.events.emit('stackReceived')
                window.off('updateSlot', onSlotUpdate)
            }
        }
        window.on('updateSlot', onSlotUpdate)
        setTimeout(() => (window.off('updateSlot', onSlotUpdate)), 500)
    }
}
