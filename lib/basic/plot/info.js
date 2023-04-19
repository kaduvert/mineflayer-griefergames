module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    Object.assign(bot.plot.info, {
        listening: false,
        currentInfo: []
    })

    bot.plot.info.parseMPP = (str) => { // MultiplePlayerProperty
        return str === plot.info.noPlayersIndicator ? [] : str.split(plot.info.flagsSeperator)
    }

    bot.plot.info.parseFlagValue = (str, type) => {
        if (type === 'Number') {
            return +str
        } else if (type === 'Array') {
            return str.substring(1, str.length - 1).split(plot.info.flagsSeperator).map(e => +e)
        } else if (type === 'Text') {
            return str
        } else if (type === 'Boolean') {
            if (str === 'true') return true
            else if (str === 'false') return false
        }
        return null
    }

    bot.plot.info.getNextSeperatorIndex = (str, index) => {
        const flagType = plot.info.flagTypes[str.substring(0, str.indexOf(plot.info.flagKeyValueSeparator, index))] ?? 'Boolean'
        let nextIndex = str.indexOf(plot.info.flagsSeperator, index)
        if (flagType === 'Array') {
            nextIndex = str.indexOf(plot.info.arrayEndIndicator + plot.info.flagsSeperator, index) + 1
        } else if (flagType === 'Text') {
            nextIndex = str.substring(index, str.length).match(plot.info.textFlagEndRegex).index + index
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
            const flagType = plot.info.flagTypes[flagKey] || 'Boolean'
            const typedFlagValue = bot.plot.info.parseFlagValue(flagValue, flagType)

            flagsObj[flagKey] = typedFlagValue
            currentIndex = nextSeperatorIndex + plot.info.flagsSeperator.length
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
            alias,
            owners: bot.plot.info.parseMPP(owners),
            biome,
            helpers: bot.plot.info.parseMPP(helpers),
            trusted: bot.plot.info.parseMPP(trusted),
            denied: bot.plot.info.parseMPP(denied),
            flags: bot.plot.info.parseFlags(flags)
        }
    }

    bot.plot.info.getRaw = (targetId = []) => {
        return bot.plot.info.get(targetId.join(plot.info.idSeparator))
    }

    bot.on('message', (msg, pos) => {
        if (!bot.plot.info.listening || pos !== 'system' || msg === '»' || plot.chatPatterns.plotInfoEnd.test(msg)) return
        bot.plot.info.currentInfo.push(msg)
    })

    bot.on('chat:plot->infoStart', () => {
        bot.plot.info.listening = true
        bot.plot.currentInfo = []
    })

    bot.on('chat:plot->infoEnd', () => {
        bot.plot.info.listening = false
        bot.plot.events.emit('misc:plot->plotInfo', [...bot.plot.info.currentInfo]) // clone it!
    })
}
