module.exports = function load(bot, ns) {
    bot.on('windowOpen:afk->challange', window => window.solveChallange())
}
