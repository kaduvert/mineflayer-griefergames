module.exports = {
	chatPatterns: {
		spamWarning: /^Bitte unterlasse das Spammen von Commands\!$/,
		/*
		spamWarning: /^\[\S+\] Du musst (\d+) Sekunden warten, bevor du diesen Befehl erneut ausführen kannst\.$/,
		spamWarning: /^\[\S+\] Du kannst diesen Befehl nur alle (\d+) Sekunden benutzen\.$/,
		spamWarning: /^$GG Bitte warte kurz\.$/,
		spamWarning: /^\[\S+\] Du kannst diesen Befehl erst nach (\d+) Sekunden benutzen\.$/,
		spamWarning: /^\[Switcher\] Daten werden noch heruntergeladen\. Bitte warte \.\.\.$/,
		spamWarning: /^\[Chat\] Bitte warte einen kleinen Moment\.$/,
		*/

		playerMessage: /^(?:\[.+\] )?(\S+) ┃ (\S+) » (.*)$/,
		broadcast: /^\[Rundruf\] (.*)$/,

		blacklistError: /^\S+ \| \S+ : (.*)$/,
		unknownCommandError: /^Unknown command\. Type "\/help" for help\.$/,
		insufficientPermissionsError: /^I'm sorry, but you do not have permission to perform this command\. Please contact the server administrators if you believe that this is in error\.$/,
		insufficientPermissionsError: /^Unzureichende Rechte\.$/,
	},
	commandBatchDelay: 3500
}
