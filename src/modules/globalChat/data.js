const COMMAND_PREFIX = '/globalchat '

module.exports = {
    chatPatterns: {
        message: /^@\[(\S+)\] (\S+) ┃ (\S+) » (.*)$/,
        inactiveError: /^\[GlobalChat\] Du kannst nicht im Global-Chat schreiben, da du ihn deaktiviert hast\.$/,

        activated: /^\[GlobalChat\] Du hast den Global-Chat aktiviert\.$/,
        deactivated: /^\[GlobalChat\] Du hast den Global-Chat deaktiviert\.$/,

        alreadyActivatedError: /^\[GlobalChat\] Der Global-Chat ist bereits aktiviert\.$/,
        alreadyDeativatedError: /^\[GlobalChat\] Der Global-Chat ist bereits deaktiviert\.$/,

        serverMuted: /^\[GlobalChat\] Du hast den Server (.+) gemutet\.$/,
        serverUnmuted: /^\[GlobalChat\] Du hast den Server (.+) entmutet\.$/,
    },
    commands: {
        login: COMMAND_PREFIX + 'login',
        logout: COMMAND_PREFIX + 'logout',
        send: '@$1',
    },
    chatActions: {
        login: {
            successEvent: 'activated',
            failureEvent: 'alreadyActivatedError',
        },
        logout: {
            successEvent: 'deactivated',
            failureEvent: 'alreadyDeativatedError'
        },
        send: {
            successEvent: 'misc:sentMessage',
            failureEvent: 'inactiveError',
        }
    },
}
