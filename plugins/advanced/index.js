const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('npc'),
    // getPlugin('perks'),
    getPlugin('antiCopy'),
    getPlugin('bank'),
    // getPlugin('booster'),
    // getPlugin('caseOpening'),
    // getPlugin('clan'),
    getPlugin('deleteparticle'),
    getPlugin('disguise'),
    // getPlugin('friends'),
    // getPlugin('hopper'),
    // getPlugin('jail'),
    getPlugin('mapInfo'),
    // getPlugin('prefix'),
    // getPlugin('profile'),
    // getPlugin('spawner'),
    // getPlugin('specialPotions'),
    getPlugin('startkick'),
    getPlugin('status'),
    // getPlugin('trails'),
    getPlugin('vote')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}