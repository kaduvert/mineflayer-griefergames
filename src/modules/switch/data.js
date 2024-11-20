module.exports = {
	chatPatterns: {
		loadedData: /^\[Switcher\] Daten heruntergeladen\!$/,
		serverFull: /^Der Server ist voll\. \[\d+\/\d+\]$/,
		switchStarted: /^$GG Serverwechsel auf (.+) wurde gestartet\.+$/,
		switchFailed: /^Kicked whilst connecting to ([a-zA-Z0-9\-_]+): (.+)$/,
		switchSucceeded: /^$GG Du wurdest automatisch auf ([a-zA-Z0-9\-_]+) verbunden\.$/,

		maintenanceMode: /^Der Server ist gerade im Wartungsmodus\.$/,
		timeout: /^Du kannst erst am ([\d\.]+) um ([\d:]+) wieder beitreten\./,
		portalWarning: /^$GG Bitte warte 12 Sekunden zwischen jedem Teleport\.$/,
		lobbyConnectionAttempt: /^Versuche auf die Lobby zu verbinden\.$/,
		portalroomConnectionAttempt: /^Versuche in den Portalraum zu verbinden\.$/,
		portalroomJoin: /^$GG Du bist im Portalraum\. Wähle deinen Citybuild aus\.$/,
		spamWarning: /^\[Switcher\] Daten werden noch heruntergeladen\. Bitte warte \.\.\.$/
	},
	commands: {
		joinPortalroom: '/portal',
		openMenu: '/switch',
		toServer: '/switch $1'
	},
	chatActions: {
		joinPortalroom: {
			successEvent: 'portalroomJoin',
			failureEvent: 'switchFailed'
		},
		openMenu: {
			successEvent: 'windowOpen:chooseServer'
		},
		toServer: {
			successEvent: 'switchStarted'
		}
	},
	hologramPatterns: {
		serverStatus: [
			/^(Online|Offline|Wartung)$/,
			/^(\d+)\/(\d+)$/
		]
	},
	portalroomTimeout: (3 * 60 * 1000),
	joinDelay: 12 * 1000,
	portalRoomSpawnBlock: [325, 66, 280],
	rankCaps: {
		'Spieler': 0,
		'Premium': 50,
		'Ultra': 50,
		'Legende': 50,
		'Titan': 85,
		'Griefer': 115,
		'Supreme': 150,
		'Hero': 150 // TODO: figure out correct value
	},
	relativePortalLocations: {
		cb1: [-16, 0, 36],
		cb2: [-16, 0, 28],
		cb3: [-16, 0, 20],
		cb4: [-16, 0, 12],
		cb5: [-16, 0, 4],
		cb6: [-16, 0, -4],
		cb7: [-16, 0, -12],
		cb8: [-16, 0, -20],
		cb9: [-16, 0, -28],
		cb10: [-16, 0, -36],
		cb11: [-12, 0, -40],
		cb12: [-4, 0, -40],
		cb13: [4, 0, -40],
		cb14: [12, 0, -40],
		cb15: [16, 0, -36],
		cb16: [16, 0, -28],
		cb17: [16, 0, -20],
		cb18: [16, 0, -12],
		cb19: [16, 0, -4],
		cb20: [16, 0, 4],
		cb21: [16, 0, 12],
		cb22: [16, 0, 20],
		cb23: [16, 0, 28],
		cb24: [16, 0, 36],
		extreme: [8, 0, 40],
		cbevil: [0, 0, 40],
		nature: [-8, 0, 40],
		farm1: [0, -1, -18],
		nether1: [0, -1, 18],
		eventserver: [-26, 14, 0]
	},
	npc: {
		identifier: 'Citybuild 1.8',
		onInteract: 'forcedMove',
		position: [16, 71, -170],
		world: 'hub'
	}
}
