module.exports = function inject(bot, options) {
    const playerUtils = bot.hostData['playerUtils']

    bot.playerUtils.getRank = (username = bot.entity.username) => {
        const displayNameParts = bot.players[username].displayName.toString().split(' ')
        if (displayNameParts.length === 3) {
            return displayNameParts[0]
        }
        return null
    }

    bot.playerUtils.compareRank = (compareFn, compareRank, rank) => {
        const rankIndex = playerUtils.ranks.indexOf(rank)
        const compareRankIndex = playerUtils.ranks.indexOf(compareRank)
        if (compareRankIndex === -1) {
            throw new Error('compareRank not indexed')
        }
        return compareFn(
            rankIndex === -1 ? Infinity : rankIndex,
            compareRankIndex
        )
    }

    bot.playerUtils.resolveNickname = (nickname) => {
        if (!nickname.startsWith(playerUtils.nicknamePrefix) || bot.players[nickname]) return nickname

        const nicknamedPlayer = Object.values(bot.players).find(player => {
            const splitDisplayName = player.displayName.toString().split(' ')
            if (splitDisplayName.length !== 3) return false
            return splitDisplayName[2] === nickname
        })

        return nicknamedPlayer.username ?? null
    }
}
