module.exports = function inject(bot, options) {
    const ggData = require('../node-griefergames-data')
    bot.ggData = ggData
}
