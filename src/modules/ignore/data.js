const COMMAND_PREFIX = '/ignore '

module.exports = {
	chatPatterns: {
		add: /^Du ignorierst ab jetzt Spieler (\S+)\.$/,
		remove: /^Du ignorierst Spieler (\S+) nicht mehr\.$/,
		list: /^Ignoriert: (.+)$/,
		listEmpty: /^Du ignoriest niemanden\.$/
	},
	commands: {
		getList: COMMAND_PREFIX,
		togglePlayer: COMMAND_PREFIX + '$1',
	},
	chatActions: {
		togglePlayer: {
            successEvents: ['add', 'remove']
		},
		getList: {
			successEvent: ['list', 'listEmpty']
		}
	}
}
