// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^ (\d+)\.\) Typ: (.+) - X: 12707\.\d+ Y: 67\.\d+ Z: 8416\.\d+$/, 'deleteParticleListItem') // deleteparticle
	// bot.chatAddPattern(/^\[GrieferGames\] Wähle einen Partikel-Effekt aus, welchen du löschen möchtest\.$/, 'deleteParticleChoose')

	bot.chatAddPattern(/^\[GrieferGames\] Bestätige bitte mit \/deleteparticle confirm. Du hast (\d+) Sekunden Zeit\.$/, 'deleteParticleConfirmRequest') // deleteparticle (index)
	bot.chatAddPattern(/^\[GrieferGames\] Der Partikel-Block \(Typ: (.+)\) wurde an Position X: ([-\d]+)\.\d+ Y: (\d+)\.\d+ Z: ([-\d]+)\.\d+ gelöscht\.$/, 'deleteParticleConfirmed') // deleteparticle confirm

    bot.chatAddPattern(/^\[GrieferGames\] In deiner Nähe befindet sich kein Partikel-Block\.$/, 'deleteParticleNotFoundError') // deleteparticle
	bot.chatAddPattern(/^\[GrieferGames\] Du hast keinen Partikel-Block, der gelöscht werden soll\.$/, 'deleteParticleNotFoundError') // deleteparticle confirm
}