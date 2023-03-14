// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^[^ ]+ ┃ ([^ ]+) möchte sich zu dir teleportieren\.$/, 'tpaRequest')
    bot.chatAddPattern(/^[^ ]+ ┃ ([^ ]+) möchte, dass du dich zu der Person teleportierst\.$/, 'tpahereRequest')
    bot.chatAddPattern(/^Anfrage gesendet an \S+ ┃ (\S+)\.$/, 'tpaSent')
    bot.chatAddPattern(/^\S+ | (\S+) hat deine Teleportierungsanfrage angenommen\.$/, 'tpaAccepted')
    bot.chatAddPattern(/^\S+ | (\S+) hat deine Teleportierungsanfrage abgelehnt\.$/, 'tpaRefused')

    bot.chatAddPattern(/^Teleportierungsanfrage verweigert\.$/, 'tpaDenied')
    bot.chatAddPattern(/^Fehler: Teleportierungsanfrage ist abgelaufen\.$/, 'tpaExpired')
    bot.chatAddPattern(/^Fehler: null$/, 'tpaNull')
    bot.chatAddPattern(/^Fehler: Du hast keine Teleportierungsanfragen\.$/, 'tpaNotFound')
    bot.chatAddPattern(/^\[GrieferGames\] Du darfst auf diesem Grundstück keine Teleportationsbefehle ausführen\.$/, 'tpaDisallowed')

    bot.chatAddPattern(/^teleportieren zu [^ ]+ ┃ ([^ ]+)\.$/, 'tpa')
    bot.chatAddPattern(/^Laufende Teleportierung abgebrochen\.$/, 'tpaCancelled')
    bot.chatAddPattern(/^\[GrieferGames\] Du konntest nicht teleportiert werden\.$/, 'tpFailure')
    bot.chatAddPattern(/^Fehler: Zeit bis zur nächsten Teleportation: (now|\d+ Sekunden)$/, 'tpSpamWarning')

	bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.getChatActionResult(`/tpa ${username}`, 'sentTpa', ['tpaDisallowed'], 7500)
    }
    
    bot.tpa.requestHere = (username) => {
        return bot.chat.getChatActionResult(`/tpahere ${username}`, 'sentTpa', ['tpaDisallowed'], 7500)
    }

    bot.tpa.accept = () => {
        return bot.chat.getChatActionResult('/tpaccept', 'tpaAccepted', ['tpaDisallowed', 'tpaNotFound', 'tpaExpired'], 7500)
    }

    bot.tpa.deny = () => {
        return bot.chat.getChatActionResult('/tpdeny', 'tpaDenied', ['tpaNotFound', 'tpaNull'], 7500)
    }
}
/*
// tptoggle

Teleportation deaktiviert.
Teleportation aktiviert.
Fehler: Ultra ┃ ColaKanone_HD verweigert die Teleportierung.
*/