const { pathfinder, Movements } = require('mineflayer-pathfinder')

module.exports = function inject(bot, options) {
    bot.loadPlugin(pathfinder)
    const moves = new Movements(bot, require('minecraft-data')(bot.version))
    moves.canDig = false
    moves.allowSprinting = false
    moves.allowParkour = false
    moves.allow1by1towers = false
    moves.blocksToAvoid.add(132)
    moves.scafoldingBlocks = []
    moves.allowEntityDetection = false
    bot.pathfinder.setMovements(moves)
}