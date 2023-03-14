const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('buyer'),
    getPlugin('seller'),
    // getPlugin('stats')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}