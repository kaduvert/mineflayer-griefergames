module.exports = function load(bot, ns) {
    bot.on('misc:mysteryMod->mysterymod_user_check', bot.mysteryMod.sendPayload)
}
