const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('griefergames-data'),
    getPlugin('basic'),
    getPlugin('advanced')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}