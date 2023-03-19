// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const spawner = bot.ggData.spawner
	bot.chat.loadPatterns(spawner)
	bot.window.loadPatterns(spawner)

	bot.spawner = {}

    bot.spawner.tryToOpen = (spawnerBlock) => {
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
        return bot.window.getClickActionResult(
            window,
            stack.slot,
            0,
            'updateSlot:' + stack.slot,
            [],
            1000,
            window
        )
    }
}
