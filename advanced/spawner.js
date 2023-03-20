const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const spawner = bot.ggData.spawner
    bot.chat.loadPatterns(spawner)
    bot.window.loadPatterns(spawner)

    bot.spawner = {
        events: new EventEmitter()
    }

    bot.spawner.tryToOpen = (spawnerBlock) => {
        const stackAtQuickbarSlot = bot.inventory.slots[bot.inventory.hotbarStart + bot.quickBarSlot]
        if (stackAtQuickbarSlot) {
            return new Promise(res => {
                res({
                    status: bot.actionResultStatus.FAILURE,
                    event: 'itemInHandError',
                    eventArgs: [stackAtQuickbarSlot]
                })
            })
        }
        bot.activateBlock(spawnerBlock)
        return bot.getActionResult(
            ['windowOpen:spawnerStorage', 'windowOpen:inactiveSpawnerMenu'],
            ['chat:spawnerAlreadyOpenedError', 'chat:noSpawnerOpenPermissionsError'],
            1000
        )
    }

    bot.spawner.getLootableStacks = (window) => {
        return window.containerItems().filter(stack =>
            stack.name !== 'stained_glass_pane' &&
            !bot.window.matchesItemPattern(stack, spawner.itemPatterns.availableExperience) &&
            !bot.window.matchesItemPattern(stack, spawner.itemPatterns.nextUpdate) &&
            !bot.window.matchesItemPattern(stack, spawner.itemPatterns.settings)
        )
    }

    bot.spawner.lootStack = (window, stack) => {
        bot.spawner.listenForIncomingStack(window, stack)
        return bot.window.getClickActionResult(
            window,
            stack.slot,
            0,
            'stackReceived',
            ['chat:noFreeInventorySpaceError'],
            1000,
            bot.spawner.events
        )
    }

    bot.spawner.listenForIncomingStack = (window, stack) => {
        const { type, metadata, count } = stack
        const beginningCount = window.countRange(window.inventoryStart, window.inventoryEnd, type, metadata)
        const onSlotUpdate = (slot) => {
            const updatedCount = window.countRange(window.inventoryStart, window.inventoryEnd, type, metadata)
            console.log(updatedCount - beginningCount, count)
            if (updatedCount - beginningCount === count) {
                bot.spawner.events.emit('stackReceived')
                window.off('updateSlot', onSlotUpdate)
            }
        }
        window.on('updateSlot', onSlotUpdate)
        setTimeout(() => (window.off('updateSlot', onSlotUpdate)), 500)
    }
}
