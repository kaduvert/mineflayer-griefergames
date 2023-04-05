const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    'plot',
    'globalChat',
    'homes',
    'itemClear',
    'mobRemover',
    'mysteryMod',
    'near',
    'pathfinder',
    'playerUtils',
    'serverInfo',
    'slowChat',
    'spawn',
    'switch'
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins.map(getPlugin))
}
