// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    // bot.chatAddPattern(/^Teleportiere\.\.\.$/, 'spawnTeleport')
    // tpSpamWarning

    bot.spawn.teleport = () => {
        return bot.chat.getChatActionResult('/spawn', 'forcedMove', ['tpSpamWarning'], 5000)
    }
}

