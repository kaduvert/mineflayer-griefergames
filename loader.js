const plugins = [
    require('./cashCollection'),
    require('./privateChat'),
    require('./serverInfo'),
    require('./pathfinder'),
    require('./switcher'),
    require('./antiAfk'),
    require('./chat'),
]

module.exports = function loader(bot, options) {
    bot.loadPlugins(plugins)
    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.timeStamp = () => '[' + (new Date()).toLocaleTimeString() + ']'
}