const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('clearchat'),
    getPlugin('cooldowns'),
    getPlugin('slowchat'),
    getPlugin('premium'),
    getPlugin('mutep'),
    getPlugin('kopf'),
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
}