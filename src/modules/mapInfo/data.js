module.exports = {
	chatPatterns: {
		info: [
			/^Information für die Karte (\S+):$/,
			/^Minecraft Server ID: (.*)$/,
			/^Dynamische ID: (\d+)$/,
			/^Server: (.+)$/,
			/^World: (\S+)$/,
			/^Ersteller: (\S+)$/,
			/^Erstellt: (.+)$/,
			/^Breite: (\d+)px$/,
			/^Höhe: (\d+)px$/,
			/^Skalierung: (\d+)$/,
			/^Ursprüngliche ID: (.+)$/,
			/^Data Size: (\d+)bytes$/,
			/^First (\d+) bytes: \[([A-Fa-f\d]+)\]$/
		],
		noDataError: /^Die Karte enthält keine Daten!$/,
	},
	commands: {
		get: '/mapinfo'
	},
	chatActions: {
		get: {
			successEvent: 'info',
			failureEvent: 'noDataError'
		}
	}
}
