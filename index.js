const PLUGINS_PATH = './plugins/'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('basic'),
    getPlugin('advanced')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}