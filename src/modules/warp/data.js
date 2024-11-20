module.exports = {
    chatPatterns: {
        list: /^Warp-Punkte: (.+)$/,
        teleport: /^Teleportiere zu Warp-Punkt (\S+)\.$/,
    },
    commands: {
        getList: '/warps',
        to: '/warp $1'
    },
    chatActions: {
        getList: {
            successEvent: 'list'
        },
        to: {
            successEvent: 'forcedMove',
            failureEvent: 'teleport->spamWarning'
        }
    }
}
