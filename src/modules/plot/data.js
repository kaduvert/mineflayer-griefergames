const COMMAND_PREFIX = '/p '
const PLOT_ACTION_COMMAND_PREFIX = COMMAND_PREFIX + '$1 '

module.exports = {
    chatPatterns: {
        infoStart: /^-+ Grundstücksinfo -+$/,
        infoEnd: /^-+ GrieferGames -+$/,
        teleport: /^$GG Du wurdest zum Grundstück teleportiert\.$/,
        flagAdded: /^$GG Die Flag wurde erfolgreich hinzugefügt\.?$/, // currently, there is no . at the end
        greeting: /^$GG \[(-?\d+;-?\d+)\] .*$/,
        chatActivated: /^$GG Die Einstellung chat wurde aktiviert\.$/, // merge?
        chatDeactivated: /^$GG Die Einstellung chat wurde deaktiviert\.$/,
        chatMessage: /^\[Plot-Chat\] ?\[(-?\d+;-?\d+)\] \S+ ┃ (\S+) : (.*)$/, // currently, there is no space between plot chat and id
        playerEntered: /^$GG \[(-?\d+;-?\d+)\] (\S+) betrat dein Grundstück\.$/,
        playerLeft: /^$GG \[(-?\d+;-?\d+)\] (\S+) verließ dein Grundstück\.$/,

        invalidNumberError: /^$GG Das ist keine gültige Zahl\.$/,
        deniedError: /^$GG Du bist auf diesem Grundstück gebannt\.$/,
        flagMustBeSetError: /^$GG Die Flag (\S+) muss gesetzt sein, damit du diese Aktion ausführen kannst\.$/,
        missingPermissionError: /^$GG Dir fehlt die Berechtigung (\S+)\.$/,
        unclaimedError: /^$GG Das Grundstück (-?\d+;-?\d+) hat bisher keinen Besitzer\.$/,
        ownerPermissionError: /^$GG Diese Aktion kann nur der Besitzer des Grundstücks ausführen\.$/,
        sethomeNotTrustedError: /^$GG Du musst auf dem Grundstück vertraut sein, um den Spawn-Punkt des Grundstücks zu versetzen\.$/,
        notFoundError: /^$GG Dein Suchmuster ergab keine Treffer\.$/,
        playerNotFoundError: /^$GG Der Spieler asd wurde nicht gefunden\.$/,
        alreadyError: /^$GG Dieser Spieler ist bereits in dieser Kategorie.$/,

        playerDenied: /^$GG Der Spieler darf dieses Grundstück nicht mehr betreten\.$/,
        playerAdded: /^$GG Dieser Spieler kann nun bauen, während der Grundstücksbesitzer online ist\.$/,
        playerTrusted: /^$GG Der Spieler wurde erfolgreich auf diesem Grundstück vertraut\.$/,
        playerRemoved: /^$GG Spieler wurde von diesem Grundstück entfernt\.$/
    },
    info: {
        arrayEndIndicator: ']',
        textFlagEndRegex: /, [a-zA-Z\_\-]+:.+/,
        idSeparator: ';',
        flagKeyValueSeparator: ':',
        multiLineRegex: /^ID: (-?\d+;-?\d+) \nAlias: (\S+) \nBesitzer: +(.+) \nBiom: ([A-Z_]+) \nHelfer: +(.+) \nVertraut: +(.+) \nVerboten: +(.+) \nFlags: (.+)$/s,
        noPlayersIndicator: 'Keine',
        unknownPlayerIndicator: 'Unbekannt',
        flagsSeparator: ', ',
        flagTypes: {
            default: 'Boolean',
            'plotFrames': 'Number',
            'time': 'Number',
            'music': 'Number',
            'use': 'Array',
            'break': 'Array',
            'place': 'Array',
            'weather': 'Text', // TODO: implement as enum
            'description': 'Text',
            'greeting': 'Text',
            'farewell': 'Text',
            'unlimited-storage-collector': 'Text' // TODO: maybe refactor to Array<String>
        }
    },
    coordination: {
        offset: 1,
        plotDimensions: {
            default: {
                usableSize: 32,
                padding: 2.5,
                edge: true
            },
            'cb7': {
                usableSize: 32,
                padding: 3.5,
                edge: true
            },
            'nature': {
                usableSize: 42,
                padding: 0,
                edge: false
            },
            'extreme': {
                usableSize: 42,
                padding: 0,
                edge: false
            }
        }
    },
    commands: {
        getInfo: COMMAND_PREFIX + 'i $1',

        goto: COMMAND_PREFIX + 'h $1',
        gotoMiddle: PLOT_ACTION_COMMAND_PREFIX + 'middle',

        setAlias: PLOT_ACTION_COMMAND_PREFIX + 'alias set $2',
        removeAlias: PLOT_ACTION_COMMAND_PREFIX + 'alias remove',

        setBiome: PLOT_ACTION_COMMAND_PREFIX + 'biome $2',

        kick: PLOT_ACTION_COMMAND_PREFIX + 'kick $2',
        ban: PLOT_ACTION_COMMAND_PREFIX + 'deny $2',

        add: PLOT_ACTION_COMMAND_PREFIX + 'add $2',
        trust: PLOT_ACTION_COMMAND_PREFIX + 'trust $2',

        remove: PLOT_ACTION_COMMAND_PREFIX + 'remove $2',

        setDescription: PLOT_ACTION_COMMAND_PREFIX + 'desc $2',
        removeDescription: PLOT_ACTION_COMMAND_PREFIX + 'desc',

        setFlag: PLOT_ACTION_COMMAND_PREFIX + 'flag set $2 $3'
    },
    chatActions: {
        getInfo: {
            successEvent: 'misc:plot->info',
            failureEvent: 'unclaimedError'
        },

        goto: {
            successEvent: 'forcedMove',
            failureEvents: ['deniedError', 'invalidNumberError']
        },
        gotoMiddle: {
            successEvent: 'forcedMove',
            failureEvent: 'deniedError'
        },

        setAlias: {
            successEvent: '',
            failureEvent: ''
        },
        removeAlias: {
            successEvent: '',
            failureEvent: ''
        },

        setBiome: {
            successEvent: '',
            failureEvent: ''
        },

        kick: {
            successEvent: 'entityGone',
            failureEvents: ['playerNotFoundError', 'ownerPermissionError']
        },
        ban: {
            successEvent: 'playerDenied',
            failureEvent: ['playerNotFoundError', 'ownerPermissionError']
        },

        add: {
            successEvent: 'playerAdded',
            failureEvent: ['playerNotFoundError', 'ownerPermissionError', 'alreadyError']
        },
        trust: {
            successEvent: 'playerTrusted',
            failureEvent: ['playerNotFoundError', 'ownerPermissionError', 'alreadyError']
        },

        remove: {
            successEvent: 'playerRemoved',
            failureEvent: ['playerNotFoundError', 'ownerPermissionError']
        },

        setDescription: {
            successEvent: '',
            failureEvent: ''
        },
        removeDescription: {
            successEvent: '',
            failureEvent: ''
        },

        setFlag: {
            successEvent: 'flagAdded',
            failureEvent: ['ownerPermissionError', 'missingPermissionError']
        }
    }
}

/*
plotInfo: [
    /^-+ Grundstücksinfo -+$/,
    /^ID: (-?\d+;-?\d+) $/,
    /^Alias: (\S+) $/,
    /^Besitzer: +(.+) $/,
    /^Biom: ([A-Z]+) $/,
    /^Helfer: (.+) $/,
    /^Vertraut: (.+) $/,
    /^Verboten: (.+) $/,
    /^Flags: (.+)$/,
    /^-+ GrieferGames -+$/
]
*/
