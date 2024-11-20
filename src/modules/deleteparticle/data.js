const COMMAND_PREFIX = '/deleteparticle '

module.exports = {
	chatPatterns: {
		listItem: /^ (\d+)\.\) Typ: (.+) - X: 12707\.\d+ Y: 67\.\d+ Z: 8416\.\d+$/, // deleteparticle
		choose: /^$GG Wähle einen Partikel-Effekt aus, welchen du löschen möchtest\.$/,

		confirmRequest: /^$GG Bestätige bitte mit \/deleteparticle confirm. Du hast (\d+) Sekunden Zeit\.$/, // deleteparticle (index)
		confirmed: /^$GG Der Partikel-Block \(Typ: (.+)\) wurde an Position X: ([-\d]+)\.\d+ Y: (\d+)\.\d+ Z: ([-\d]+)\.\d+ gelöscht\.$/, // deleteparticle confirm

		notOnPlotError: /^$GG Du musst dich auf einem Grundstück befinden\.$/,
		notFoundError: /^$GG In deiner Nähe befindet sich kein Partikel-Block\.$/, // deleteparticle
		notFoundError: /^$GG Du hast keinen Partikel-Block, der gelöscht werden soll\.$/, // deleteparticle confirm
	},
	commands: {
		getParticles: COMMAND_PREFIX,
		fromIndex: COMMAND_PREFIX + '$1',
		confirm: COMMAND_PREFIX + 'confirm'
	}
}
