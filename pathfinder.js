const { pathfinder, Movements } = require('mineflayer-pathfinder')

module.exports = function inject(bot, options) {
    bot.loadPlugin(pathfinder)
    const mcData = require('minecraft-data')(bot.version)
    const moves = new Movements(bot, mcData)
    moves.canDig = false
    moves.allowSprinting = false
    moves.allowParkour = false
    moves.allow1by1towers = false
    moves.blocksToAvoid.add(mcData.blocksByName['iron_trapdoor'])
    moves.scafoldingBlocks = []
    moves.allowEntityDetection = false
    // moves.allowFreeMotion = true
    // moves.entitiesToAvoid = new Set()
    // moves.passableEntities.add('player')
    bot.pathfinder.setMovements(moves)
}