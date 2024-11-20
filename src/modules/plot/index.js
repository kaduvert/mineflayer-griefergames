const plugins = [
    require('./actions'),
    require('./info'),
    require('./coordination')
]

module.exports = function load(bot, ns) {
    plugins.forEach(plugin => plugin(bot, ns))
}
