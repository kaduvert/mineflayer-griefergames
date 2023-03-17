const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const plot = bot.ggData.plot
    bot.loadChatPatterns(plot)

    bot.plot = {
        listeningForInfo: false,
        currentInfo: [],
        events: new EventEmitter()
    }

    bot.plot.parseMPP = (str) => { // MultiplePlayerProperty
        return str === plot.infoNoPlayersIndicator ? [] : str.split(plot.flagsSeperator)
    }

    bot.plot.parseFlagValue = (str, type) => {
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

    bot.plot.getNextSeperatorIndex = (str, index) => {
        const flagType = plot.flagTypes[str.substring(0, str.indexOf(plot.flagKeyValueSeparator, index))] || 'Boolean'
        let nextIndex = str.indexOf(plot.flagsSeperator, index)
        if (flagType === 'Array') {
            nextIndex = str.indexOf(plot.arrayEndIndicator + plot.flagsSeperator, index) + 1
        } else if (flagType === 'Text') {
            nextIndex = str.substring(index, str.length).match(plot.textFlagEndRegex).index + index
        }
        return nextIndex === -1 ? index === str.length ? -1 : str.length : nextIndex
    }

    bot.plot.parseFlags = (flagsStr) => {
        const flagsObj = {}
        let currentIndex = 0
        let currentFlag = ''
        let nextSeperatorIndex = bot.plot.getNextSeperatorIndex(flagsStr, currentIndex)
        while (currentFlag = flagsStr.substring(currentIndex, nextSeperatorIndex)) {
            const [flagKey, flagValue] = currentFlag.split(plot.flagKeyValueSeparator)
            const flagType = plot.flagTypes[flagKey] || 'Boolean'
            const typedFlagValue = bot.plot.parseFlagValue(flagValue, flagType)

            flagsObj[flagKey] = typedFlagValue
            currentIndex = nextSeperatorIndex + plot.flagsSeperator.length
            nextSeperatorIndex = bot.plot.getNextSeperatorIndex(flagsStr, currentIndex)
            if (nextSeperatorIndex === -1) break
        }
        return flagsObj
    }

    bot.plot.parseInfo = (rawPlotInfo) => {
        const plotInfo = rawPlotInfo.join('\n').match(plot.multiLinePlotInfoRegex)
        if (!plotInfo) return null
        const [_, id, alias, owners, biome, helpers, trusted, denied, flags] = plotInfo
        return {
            id: id.split(plot.IdSeparator).map(e => +e),
            alias,
            owners: bot.plot.parseMPP(owners),
            biome,
            helpers: bot.plot.parseMPP(helpers),
            trusted: bot.plot.parseMPP(trusted),
            denied: bot.plot.parseMPP(denied),
            flags: bot.plot.parseFlags(flags)
        }
    }

    bot.plot.getRawInfo = (targetId = []) => {
        return bot.chat.getChatActionResult(plot.commands.getInfo(targetId.join(plot.IdSeparator)), 'plotInfo', ['plotUnclaimedError'], 5000, bot.plot.events)
    }

    bot.on('message', (msg, pos) => {
        if (!bot.plot.listeningForInfo || pos !== 'system' || msg === '»' || plot.chatPatterns.plotInfoEnd.test(msg)) return
        bot.plot.currentInfo.push(msg)
    })

    bot.on('plotInfoStart', () => {
        bot.plot.listeningForInfo = true
        bot.plot.currentInfo = []
    })

    bot.on('plotInfoEnd', () => {
        bot.plot.listeningForInfo = false
        bot.plot.events.emit('plotInfo', [...bot.plot.currentInfo]) // clone it!
    })
}