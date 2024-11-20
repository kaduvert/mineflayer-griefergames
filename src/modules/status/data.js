const COMMAND_PREFIX = '/status '

module.exports = {
	chatPatterns: {
		set: /^\[Status\] Du hast '(.+)' als Status gesetzt\.$/,
		activated: /^\[Status\] Du hast den Status beim Joinen aktiviert\.$/,
		deactivated: /^\[Status\] Du hast den Status beim Joinen deaktiviert\.$/,
	},
	commands: {
		set: COMMAND_PREFIX + '$1',
		toggle: COMMAND_PREFIX + 'toggle',
	},
	chatActions: {
		set: {
			successEvent: 'set',
			failureEvent: 'insufficientPermissionsError'
		},
		toggle: {
			successEvents: ['activated', 'deactivated'],
            failureEvent: 'insufficientPermissionsError'
		}
	}
}
