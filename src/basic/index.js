const plugins = [
    require('./plot'),
    require('./globalChat'),
    require('./homes'),
    require('./itemClear'),
    require('./mobRemover'),
    require('./mysteryMod'),
    require('./money'),
    require('./near'),
    require('./pathfinder'),
    require('./playerUtils'),
    require('./privateChat'),
    require('./serverInfo'),
    require('./slowChat'),
    require('./switch'),
    require('./tpa')
]

module.exports = function load(bot, ns) {
    plugins.forEach(plugin => plugin(bot, ns))
}
