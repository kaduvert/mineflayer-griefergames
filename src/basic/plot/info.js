module.exports = function load(bot, ns) {
    const plot = ns.data['plot']

    Object.assign(ns.plot.info, {
        listening: false,
        current: []
    })

    ns.plot.info.parseId = (str) => str.split(plot.info.idSeparator).map(e => +e)

    ns.plot.info.parseMPP = (str) => { // MultiplePlayerProperty
        return str === plot.info.noPlayersIndicator ? [] : str.split(plot.info.flagsSeparator).map(playerName => playerName === plot.info.unknownPlayerIndicator ? null : playerName)
    }

    ns.plot.info.parseAlias = (str) => str === plot.info.noPlayersIndicator ? null : str

    ns.plot.info.deserializeFlagValue = (str, type) => {
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

    ns.plot.info.serializeFlagValue = (value) => {
        return (typeof value === 'string' ? value : value.toString())
    }

    ns.plot.info.getNextSeperatorIndex = (str, index) => {
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

    ns.plot.info.parseFlags = (flagsStr) => {
        const flags = {}
        let currentIndex = 0
        let currentFlag = ''
        let nextSeperatorIndex = ns.plot.info.getNextSeperatorIndex(flagsStr, currentIndex)
        while (currentFlag = flagsStr.substring(currentIndex, nextSeperatorIndex)) {
            const [flagKey, flagValue] = currentFlag.split(plot.info.flagKeyValueSeparator)
            const flagType = plot.info.flagTypes[flagKey] ?? plot.info.flagTypes.default
            const typedFlagValue = ns.plot.info.deserializeFlagValue(flagValue, flagType)

            flags[flagKey] = typedFlagValue
            currentIndex = nextSeperatorIndex + plot.info.flagsSeparator.length
            nextSeperatorIndex = ns.plot.info.getNextSeperatorIndex(flagsStr, currentIndex)
            if (nextSeperatorIndex === -1) break
        }
        return flags
    }

    ns.plot.info.parse = (rawPlotInfo) => {
        const plotInfo = rawPlotInfo.join('\n').match(plot.info.multiLineRegex)
        if (!plotInfo) return null
        const [_, id, alias, owners, biome, helpers, trusted, denied, flags] = plotInfo
        return {
            id: ns.plot.info.parseId(id),
            alias: ns.plot.info.parseAlias(alias),
            owners: ns.plot.info.parseMPP(owners),
            biome,
            helpers: ns.plot.info.parseMPP(helpers),
            trusted: ns.plot.info.parseMPP(trusted),
            denied: ns.plot.info.parseMPP(denied),
            flags: ns.plot.info.parseFlags(flags)
        }
    }

    ns.plot.info.get = (targetId = '') => {
        return ns.plot.getInfo(targetId)
            .then(result => {
                return result.hasSucceeded() ? ns.plot.info.parse(result.eventArgs[0]) : null
            })
    }

    ns.plot.info.isEqualId = (one, two) => one[0] === two[0] && one[1] === two[1]

    bot.on('message', (msg, pos) => {
        if (!ns.plot.info.listening || pos !== 'system' || msg === '»' || plot.chatPatterns.infoEnd.test(msg.toString())) return
        ns.plot.info.current.push(msg.toString())
    })

    bot.on('chat:plot->infoStart', () => {
        ns.plot.info.listening = true
        ns.plot.info.current = []
    })

    bot.on('chat:plot->infoEnd', () => {
        ns.plot.info.listening = false
        bot.emit('misc:plot->info', [...ns.plot.info.current]) // clone it!
    })

    bot.on('chat:plot->playerEntered', (stringId, username) => {
        bot.emit('misc:plot->playerEntered', ns.plot.info.parseId(stringId), username)
    })

    bot.on('chat:plot->playerLeft', (stringId, username) => {
        bot.emit('misc:plot->playerLeft', ns.plot.info.parseId(stringId), username)
    })
}
