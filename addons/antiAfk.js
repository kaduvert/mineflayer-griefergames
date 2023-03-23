module.exports = function inject(bot, options) {
    bot.on('windowOpen:afk->challange', bot.afk.pass)
}
