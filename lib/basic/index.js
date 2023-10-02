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
    'money',
    'near',
    'pathfinder',
    'playerUtils',
    'privateChat',
    'serverInfo',
    'slowChat',
    'spawn',
    'switch',
    'tpa'
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins.map(getPlugin))
}
