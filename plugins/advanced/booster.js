// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^Folgende Booster sind auf diesem Server aktiv:$/, 'boosterHeader')
    bot.chatAddPattern(/^(\S+)-Booster: (.+)$/, 'boosterStatus')
    bot.chatAddPattern(/^\[Booster\] \S+ ┃ (\S+) hat für die GrieferGames Community den (\S+)-Booster für (\d+) Minuten aktiviert\.$/, 'boosterActivated')
    bot.chatAddPattern(/^\[Booster\] Der Fly-Booster ist beendet\. Dein Flugmodus wird deaktiviert\.\.\.$/, 'boosterFlyExpiredWarning')
    bot.chatAddPattern(/^\[Booster\] Der (\S+)-Booster ist jetzt wieder deaktiviert\.$/, 'boosterDeactivated')
    bot.chatAddPattern(/^\[GrieferGames\] Der Fast-Break-Effekt wurde entfernt\.$/, 'boosterBreakEffectRemoved')

    bot.booster = {}


}

[GrieferGames] Du hast nun wieder den Fast-Break-Effekt.