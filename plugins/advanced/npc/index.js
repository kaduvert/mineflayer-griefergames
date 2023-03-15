const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    // getPlugin('adventure'),
    // getPlugin('edgeBlacksmith'),
    getPlugin('orbs'),
    // getPlugin('vote'),
    getPlugin('main'),
    getPlugin('window')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}