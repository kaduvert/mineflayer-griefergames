const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    // getPlugin('adventure'),
    // getPlugin('orbs'),
    // getPlugin('perks'),
    getPlugin('antiCopy'),
    getPlugin('bank'),
    // getPlugin('booster'),
    // getPlugin('caseOpening'),
    // getPlugin('clan'),
    // getPlugin('deleteparticle'),
    getPlugin('disguise'),
    // getPlugin('edgeConfigurator'),
    // getPlugin('friends'),
    // getPlugin('hopper'),
    // getPlugin('jail'),
    // getPlugin('lottery'),
    getPlugin('mapInfo'),
    getPlugin('npc'),
    // getPlugin('prefix'),
    // getPlugin('profile'),
    // getPlugin('ptime'),
    getPlugin('punishment'),
    getPlugin('spawner'),
    // getPlugin('specialPotions'),
    getPlugin('startJail'),
    getPlugin('status'),
    // getPlugin('trails'),
    getPlugin('vote')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}