const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    'adventure',
    'orbs',
    'perks',
    'antiCopy',
    'bank',
    'disguise',
    'itemSign',
    'lift',
    'mapInfo',
    'npc',
    'prefix',
    'punishment',
    'spawner',
    'startJail',
    'teleporter'
]

module.exports = function load(bot, ns) {
    bot.loadPlugins(plugins.map(getPlugin))
}
