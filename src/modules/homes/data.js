module.exports = {
    chatPatterns: {
        list: /^$GG Deine Home-Punkte: (.+)$/,
        unset: /^$GG Du hast bisher (keine)n Home-Punkt erstellt\.$/,

        set: /^$GG Der Home-Punkt wurde auf deine aktuelle Position gesetzt\.$/,
        deleted: /^$GG Der Home-Punkt (\S+) wurde gelöscht\.$/,

        notFoundError: /^$GG Der Home-Punkt (\S+) wurde nicht gefunden. Nutze \/sethome, um diesen zu setzen\.$/,
    },
    commands: {
        getList: '/homes',
        set: '/sethome $1',
        delete: '/delhome $1',
        teleportTo: '/home $1'
    },
    chatActions: {
        getList: {
            successEvents: ['list', 'unset'],
            timeout: 5000
        },
        set: {
            successEvent: 'set'
        },
        delete: {
            successEvent: 'deleted',
            failureEvent: 'notFoundError'
        },
        teleportTo: {
            successEvent: 'forcedMove',
            failureEvents: ['notFoundError', 'teleport->failure', 'teleport->spamWarning']
        }
    }
}
