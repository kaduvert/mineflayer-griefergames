module.exports = {
    chatPatterns: {
        teleport: /^Teleportiere\.\.\.$/
    },
    commands: {
        teleport: '/spawn'
    },
    chatActions: {
        teleport: {
            successEvent: 'forcedMove',
            failureEvent: 'teleport->spamWarning'
        }
    }
}
