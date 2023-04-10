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
    'mapInfo',
    'npc',
    'prefix',
    'punishment',
    'spawner',
    'startJail'
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins.map(getPlugin))
}
