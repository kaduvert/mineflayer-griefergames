// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^$/, 'jailVoting')
	bot.chatAddPattern(/^\[GrieferGames\] Du wurdest in das Gefängnis eingesperrt\.$/, 'jailIncarcerated')
	bot.chatAddPattern(/^\[GrieferGames\] Du hast das Gefängnis verlassen\.$/, 'jailReleased')

	bot.jail = {}


}

[GrieferGames] Bitte warte kurz...
[StartJail] Du hast erfolgreich einen Gefängnis-Token gekauft.
