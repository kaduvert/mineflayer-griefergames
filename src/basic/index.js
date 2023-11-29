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
    'switch',
    'tpa'
]

module.exports = function load(bot, ns) {
    plugins.forEach(plugin => getPlugin(plugin)(bot, ns))
}
