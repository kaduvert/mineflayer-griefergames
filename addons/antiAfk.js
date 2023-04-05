module.exports = function inject(bot, options) {
    bot.on('windowOpen:afk->challange', window => window.solveChallange())
}
