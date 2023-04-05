// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const disguise = bot.hostData['disguise']

    bot.disguise.current = null

    bot.on('chat:disguise->disguised', ([[disguiseIdentifier]]) => {
        bot.disguise.current = disguiseIdentifier
    })
}
