const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    // getPlugin('buyer'),
    // getPlugin('seller'),
    // getPlugin('stats')
]

const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.orbs = {
        events: new EventEmitter()
    }
    bot.loadPlugins(plugins)
}