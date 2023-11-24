const { pathfinder, Movements } = require('mineflayer-pathfinder')

module.exports = function load(bot, ns) {
    bot.loadPlugin(pathfinder)
    const moves = new Movements(bot)
    moves.canDig = false
    // moves.allowSprinting = false
    moves.allowParkour = false
    moves.allow1by1towers = false
    moves.scafoldingBlocks = []
    moves.allowEntityDetection = false
    // moves.allowFreeMotion = true
    // moves.entitiesToAvoid = new Set()
    // moves.passableEntities.add('player')
    bot.pathfinder.setMovements(moves)
}
