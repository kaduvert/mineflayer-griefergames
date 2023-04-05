module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    Object.assign(bot.plot.info, {
        listeningForInfo: false,
        currentInfo: []
    })

    bot.plot.info.parseMPP = (str) => { // MultiplePlayerProperty
        return str === plot.infoNoPlayersIndicator ? [] : str.split(plot.flagsSeperator)
    }

    bot.plot.info.parseFlagValue = (str, type) => {
        if (type === 'Number') {
            return +str
        } else if (type === 'Array') {
            return str.substring(1, str.length - 1).split(plot.flagsSeperator).map(e => +e)
        } else if (type === 'Text') {
            return str
        } else if (type === 'Boolean') {
            if (str === 'true') return true
            else if (str === 'false') return false
        }
        return null
    }

    bot.plot.info.getNextSeperatorIndex = (str, index) => {
        const flagType = plot.flagTypes[str.substring(0, str.indexOf(plot.flagKeyValueSeparator, index))] || 'Boolean'
        let nextIndex = str.indexOf(plot.flagsSeperator, index)
        if (flagType === 'Array') {
            nextIndex = str.indexOf(plot.arrayEndIndicator + plot.flagsSeperator, index) + 1
        } else if (flagType === 'Text') {
            nextIndex = str.substring(index, str.length).match(plot.textFlagEndRegex).index + index
        }
        return nextIndex === -1 ? (index === str.length ? -1 : str.length) : nextIndex
    }

    bot.plot.info.parseFlags = (flagsStr) => {
        const flagsObj = {}
        let currentIndex = 0
        let currentFlag = ''
        let nextSeperatorIndex = bot.plot.info.getNextSeperatorIndex(flagsStr, currentIndex)
        while (currentFlag = flagsStr.substring(currentIndex, nextSeperatorIndex)) {
            const [flagKey, flagValue] = currentFlag.split(plot.flagKeyValueSeparator)
            const flagType = plot.flagTypes[flagKey] || 'Boolean'
            const typedFlagValue = bot.plot.info.parseFlagValue(flagValue, flagType)

            flagsObj[flagKey] = typedFlagValue
            currentIndex = nextSeperatorIndex + plot.flagsSeperator.length
            nextSeperatorIndex = bot.plot.info.getNextSeperatorIndex(flagsStr, currentIndex)
            if (nextSeperatorIndex === -1) break
        }
        return flagsObj
    }

    bot.plot.info.parse = (rawPlotInfo) => {
        const plotInfo = rawPlotInfo.join('\n').match(plot.multiLinePlotInfoRegex)
        if (!plotInfo) return null
        const [_, id, alias, owners, biome, helpers, trusted, denied, flags] = plotInfo
        return {
            id: id.split(plot.IdSeparator).map(e => +e),
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
        return bot.chat.sendFallible({
            patternHead: 'plot',
            command: ['getInfo', targetId.join(plot.IdSeparator)],
            successEvent: 'misc:plotInfo',
            failureEvent: 'plotUnclaimedError',
            timeout: 5000
        })
    }

    bot.on('message', (msg, pos) => {
        if (!bot.plot.listeningForInfo || pos !== 'system' || msg === '»' || plot.chatPatterns.plotInfoEnd.test(msg)) return
        bot.plot.currentInfo.push(msg)
    })

    bot.on('chat:plot->infoStart', () => {
        bot.plot.listeningForInfo = true
        bot.plot.currentInfo = []
    })

    bot.on('chat:plot->infoEnd', () => {
        bot.plot.listeningForInfo = false
        bot.plot.events.emit('misc:plot->plotInfo', [...bot.plot.currentInfo]) // clone it!
    })
}
