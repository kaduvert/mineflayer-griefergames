module.exports = {
    chatPatterns: {
        playerList: /^Spieler in der Nähe: (.+)$/
    },
    commands: {
        getPlayers: '/near $1'
    },
    chatActions: {
        getPlayers: {
            successEvent: 'playerList'
        }
    },
    playerListSeparator: ', ',
    playerListRegex: /^\S+ ┃ (\S+)\((\d+)m\)$/
}
