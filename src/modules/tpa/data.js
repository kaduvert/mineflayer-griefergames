module.exports = {
    chatPatterns: {
        request: /^\S+ ┃ (\S+) möchte sich zu dir teleportieren\.$/,
        hereRequest: /^\S+ ┃ (\S+) möchte, dass du dich zu der Person teleportierst\.$/,
        sent: /^Anfrage gesendet an \S+ ┃ (\S+)\.$/,
        accepted: /^\S+ | (\S+) hat deine Teleportierungsanfrage angenommen\.$/,
        refused: /^\S+ | (\S+) hat deine Teleportierungsanfrage abgelehnt\.$/,

        activated: /^Teleportation aktiviert\.$/,
        deactivated: /^Teleportation deaktiviert\.$/,
        denied: /^Teleportierungsanfrage verweigert\.$/,

        toggledError: /^Fehler: \S+ ┃ (\S+) verweigert die Teleportierung\.$/,
        expiredError: /^Fehler: Teleportierungsanfrage ist abgelaufen\.$/,
        nullError: /^Fehler: null$/,
        notFoundError: /^Fehler: Du hast keine Teleportierungsanfragen\.$/,
        disallowedError: /^$GG Du darfst auf diesem Grundstück keine Teleportationsbefehle ausführen\.$/,

        tpa: /^teleportieren zu \S+ ┃ (\S+)\.$/,
        cancelled: /^Laufende Teleportierung abgebrochen\.$/,
    },
    commands: {
        request: '/tpa $1',
        requestHere: '/tpahere $1',
        accept: '/tpaccept',
        deny: '/tpdeny',
        toggle: '/tptoggle'
    },
    chatActions: {
        request: {
            successEvent: 'sent',
            failureEvents: ['toggledError', 'disallowedError']
        },
        requestHere: {
            successEvent: 'sent',
            failureEvents: ['toggledError', 'disallowedError']
        },
        accept: {
            successEvent: 'accepted',
            failureEvents: ['disallowedError', 'notFoundError', 'expiredError']
        },
        deny: {
            successEvent: 'denied',
            failureEvents: ['notFoundError', 'nullError']
        },
        toggle: {
            successEvents: ['activated', 'deactivated'],
            failureEvents: ['notFoundError', 'nullError']
        }
    }
}
