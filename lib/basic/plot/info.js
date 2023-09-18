module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    bot.plot.info = {}
    Object.assign(bot.plot.info, {
        listening: false,
        current: []
    })

    bot.plot.info.parseMPP = (str) => { // MultiplePlayerProperty
        return str === plot.info.noPlayersIndicator ? [] : str.split(plot.info.flagsSeparator).map(playerName => playerName === plot.info.unknownPlayerIndicator ? null : playerName)
    }

    bot.plot.info.parseAlias = (str) => str === plot.info.noPlayersIndicator ? null : str

    bot.plot.info.deserializeFlagValue = (str, type) => {
        if (type === 'Number') {
            return +str
        } else if (type === 'Array') {
            return str.substring(1, str.length - 1).split(plot.info.flagsSeparator).map(e => +e)
        } else if (type === 'Text') {
            return str
        } else if (type === 'Boolean') {
            if (str === 'true') return true
            else if (str === 'false') return false
        }
        return null
    }

    bot.plot.info.serializeFlagValue = (value) => {
        return (typeof value === 'string' ? value : value.toString())
    }

    bot.plot.info.getNextSeperatorIndex = (str, index) => {
        let currentFlag = str.substring(0, str.indexOf(plot.info.flagKeyValueSeparator, index))
        if (index > 0) {
            currentFlag = currentFlag.substring(currentFlag.lastIndexOf(plot.info.flagsSeparator) + plot.info.flagsSeparator.length)
        }
        const currentFlagType = plot.info.flagTypes[currentFlag]
        let nextIndex = str.indexOf(plot.info.flagsSeparator, index)
        if (currentFlagType === 'Array') {
            nextIndex = str.indexOf(plot.info.arrayEndIndicator, index) + plot.info.arrayEndIndicator.length
        } else if (currentFlagType === 'Text') {
            const textFlagEndMatch = str.substring(index, str.length).match(plot.info.textFlagEndRegex)
            nextIndex = textFlagEndMatch ? textFlagEndMatch.index + index : -1
        }
        return nextIndex === -1 ? (index === str.length ? -1 : str.length) : nextIndex
    }

    bot.plot.info.parseFlags = (flagsStr) => {
        const flagsObj = {}
        let currentIndex = 0
        let currentFlag = ''
        let nextSeperatorIndex = bot.plot.info.getNextSeperatorIndex(flagsStr, currentIndex)
        while (currentFlag = flagsStr.substring(currentIndex, nextSeperatorIndex)) {
            const [flagKey, flagValue] = currentFlag.split(plot.info.flagKeyValueSeparator)
            const flagType = plot.info.flagTypes[flagKey] ?? plot.info.flagTypes.default
            const typedFlagValue = bot.plot.info.deserializeFlagValue(flagValue, flagType)

            flagsObj[flagKey] = typedFlagValue
            currentIndex = nextSeperatorIndex + plot.info.flagsSeparator.length
            nextSeperatorIndex = bot.plot.info.getNextSeperatorIndex(flagsStr, currentIndex)
            if (nextSeperatorIndex === -1) break
        }
        return flagsObj
    }

    bot.plot.info.parse = (rawPlotInfo) => {
        const plotInfo = rawPlotInfo.join('\n').match(plot.info.multiLineRegex)
        if (!plotInfo) return null
        const [_, id, alias, owners, biome, helpers, trusted, denied, flags] = plotInfo
        return {
            id: id.split(plot.info.idSeparator).map(e => +e),
            alias: bot.plot.info.parseAlias(alias),
            owners: bot.plot.info.parseMPP(owners),
            biome,
            helpers: bot.plot.info.parseMPP(helpers),
            trusted: bot.plot.info.parseMPP(trusted),
            denied: bot.plot.info.parseMPP(denied),
            flags: bot.plot.info.parseFlags(flags)
        }
    }

    bot.plot.info.get = (targetId = '') => {
        return bot.plot.getInfo(targetId)
            .then(result => {
                return result.hasSucceeded() ? bot.plot.info.parse(result.eventArgs[0]) : null
            })
    }

    bot.on('message', (msg, pos) => {
        if (!bot.plot.info.listening || pos !== 'system' || msg === '»' || plot.chatPatterns.infoEnd.test(msg.toString())) return
        bot.plot.info.current.push(msg.toString())
    })

    bot.on('chat:plot->infoStart', () => {
        bot.plot.info.listening = true
        bot.plot.info.current = []
    })

    bot.on('chat:plot->infoEnd', () => {
        bot.plot.info.listening = false
        bot.emit('misc:plot->info', [...bot.plot.info.current]) // clone it!
    })
}
