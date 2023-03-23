module.exports = function inject(bot, options) {
    bot.mysteryMod.events.on('mysterymod_user_check', bot.mysteryMod.sendPayload)
}
