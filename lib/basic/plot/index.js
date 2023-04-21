const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    'actions',
    'info',
    'coordination'
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins.map(getPlugin))
}
