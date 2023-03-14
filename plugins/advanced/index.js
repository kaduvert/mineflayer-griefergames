const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('adventurer'),
    getPlugin('booster'),
    getPlugin('hopper'),
    getPlugin('jail'),
    getPlugin('mysteryMod'),
    getPlugin('orbs'),
    getPlugin('startkick'),
    getPlugin('vote'),
    getPlugin('perks')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}