module.exports = function load(bot, ns) {
    const prefix = ns['prefix'].data

    const extractNonBoldColorCodes = (str) => {
        let colorCodes = ''
        for (let i = 0; i < str.length; i++) {
            if (str[i - 1] === '§' && str[i] !== 'l') colorCodes += str[i]
        }
        return colorCodes
    }

    const clearDoubleCodes = (str) => {
        let clearedStr = ''
        for (let i = 0; i < str.length; i++) {
            if (str[i] === clearedStr[clearedStr.length - 1]) {
                continue
            } else {
                clearedStr += str[i]
            }
        }
        return clearedStr
    }

    bot.pattern.prefix = {}

    bot.pattern.prefix.matchFormattedString = (str, pattern) => {
        pattern = clearDoubleCodes(pattern)
        let codes = clearDoubleCodes(extractNonBoldColorCodes(str))
        if (!codes.length) return (pattern === codes)
        codes = codes.repeat(Math.ceil(pattern.length / codes.length))

        for (let i = 0; i < codes.length; i++) {
            if (codes[i] !== pattern[i % pattern.length]) return false
        }
        return true
    }

    bot.pattern.prefix.match = (displayName, prefixPattern) => {
        const [rank, _, name] = displayName.split(' ')

        if (typeof prefixPattern === 'string') {
            prefixPattern = [prefixPattern, prefixPattern]
        }

        return (
            bot.pattern.prefix.matchFormattedString(rank, prefixPattern[0]) &&
            bot.pattern.prefix.matchFormattedString(name, prefixPattern[1])
        )
    }

    ns.prefix = {}

    ns.prefix.get = (username = bot.username) => {
        const player = bot.players[username]

        for (const prefixPatternName of Object.keys(prefix.prefixPatterns)) {
            const prefixPattern = prefix.prefixPatterns[prefixPatternName]

            if (bot.pattern.prefix.match(player.displayName.toMotd(), prefixPattern)) {
                return prefixPatternName
            }
        }

        return null
    }
}
