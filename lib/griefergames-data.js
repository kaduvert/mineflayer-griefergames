module.exports = function inject(bot, options) {
    const hostData = require('griefergames-data')
    bot.hostData = hostData
}
