const NICK_COMMAND_PREFIX = '/nick '

module.exports = {
    chatPatterns: {
        changed: /^\[Nick\] Dein neuer Name lautet nun (\S+)\.$/,
        spamWarning: /^\[Nick\] Du kannst dich nur alle (\d+) Sekunden umbenennen\.$/,
        reset: /^\[Nick\] Dein Name wurde zurückgesetzt\.$/,
        notNickedError: /^\[Nick\] Du bist nicht umbenannt\.$/
    },
    nicknamePrefix: '~',
    commands: {
        as: NICK_COMMAND_PREFIX + '$1',
        off: NICK_COMMAND_PREFIX + 'off'
    },
    chatActions: {
        as: {
            successEvent: 'changed'
        },
        off: {
            successEvent: 'reset',
            failureEvent: 'notNickedError'
        }
    }
}
