const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    'actions',
    'info',
    'coordination'
]

module.exports = function load(bot, ns) {
    plugins.forEach(plugin => getPlugin(plugin)(bot, ns))
}
