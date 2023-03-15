const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const plotInfoReg = /^ID: (-?\d+;-?\d+) \nAlias: ([^ ]+) \nBesitzer: +(.+) \nBiom: ([A-Z]+) \nHelfer: (.+) \nVertraut: (.+) \nVerboten: (.+) \nFlags: (.+)$/s
    const plotInfoEndReg = /^-+ GrieferGames -+$/

    const flagTypes = {
        'time': 'Number',
        'music': 'Number',
        'use': 'Array',
        'break': 'Array',
        'place': 'Array',
        'description': 'Text',
        'greeting': 'Text',
        'farewell': 'Text'
    }

    const FLAGS_SEPERATOR = ', '

    bot.chatAddPattern(plotInfoEndReg, 'plotInfoEnd')
    bot.chatAddPattern(/^-+ Grundstücksinfo -+$/, 'plotInfoStart')
    bot.chatAddPattern(/^\[GrieferGames\] Du wurdest zum Grundstück teleportiert\.$/, 'plotTeleport')
    bot.chatAddPattern(/^\[GrieferGames\] Die Flag wurde erfolgreich hinzugefügt$/, 'plotFlagAdded') // source for error if . is added at the end
    bot.chatAddPattern(/^\[GrieferGames\] \[(-?\d+;-?\d+)\] .*$/, 'plotGreeting')
    bot.chatAddPattern(/^\[GrieferGames\] Die Einstellung chat wurde aktiviert\.$/, 'plotChatActivated') // merge?
    bot.chatAddPattern(/^\[GrieferGames\] Die Einstellung chat wurde deaktiviert\.$/, 'plotChatDeactivated')
    bot.chatAddPattern(/^\[Plot-Chat\]\[(-?\d+;-?\d+)\] \S+ ┃ (\S+) : (.*)$/, 'plotChatMessage')
    bot.chatAddPattern(/^\[GrieferGames\] \[(-?\d+;-?\d+)\] ([^ ]+) betrat dein Grundstück\.$/, 'plotPlayerEntered')
    bot.chatAddPattern(/^\[GrieferGames\] \[(-?\d+;-?\d+)\] ([^ ]+) verließ dein Grundstück\.$/, 'plotPlayerLeft')

    bot.chatAddPattern(/^\[GrieferGames\] Die Flag (\S+) muss gesetzt sein, damit du diese Aktion ausführen kannst\.$/, 'plotFlagMustBeSetError')
    bot.chatAddPattern(/^\[GrieferGames\] Dir fehlt die Berechtigung (\S+)\.$/, 'plotMissingPermission')
    bot.chatAddPattern(/^\[GrieferGames\] Das Grundstück (-?\d+;-?\d+) hat bisher keinen Besitzer\.$/, 'plotUnclaimedError')
    bot.chatAddPattern(/^\[GrieferGames\] Diese Aktion kann nur der Besitzer des Grundstücks ausführen\.$/, 'plotOwnerPermissionError')
    bot.chatAddPattern(/^\[GrieferGames\] Du musst auf dem Grundstück vertraut sein, um den Spawn-Punkt des Grundstücks zu versetzen\.$/, 'plotSethomeError')
    bot.chatAddPattern(/^\[GrieferGames\] Dein Suchmuster ergab keine Treffer\.$/, 'plotNotFoundError')

    bot.plot = {
        listeningForInfo: false,
        currentInfo: [],
        events: new EventEmitter()
    }
    
    bot.plot.parseMPP = (str) => { // MultiplePlayerProperty
        return str === 'Keine' ? [] : str.split(FLAGS_SEPERATOR)
    }

    bot.plot.parseFlagValue = (str, type) => {
        if (type === 'Number') {
            return +str
        } else if (type === 'Array') {
            return str.substring(1, str.length - 1).split(FLAGS_SEPERATOR).map(e => +e)
        } else if (type === 'Text') {
            return str
        } else if (type === 'Boolean') {
            if (str === 'true') return true
            else if (str === 'false') return false
        }
        return null
    }

    bot.plot.getNextSeperatorIndex = (str, index) => {
        const flagType = flagTypes[str.substring(0, str.indexOf(':', index))] || 'Boolean'
        let nextIndex = str.indexOf(FLAGS_SEPERATOR, index)
        if (flagType === 'Array') {
            nextIndex = str.indexOf(']' + FLAGS_SEPERATOR, index) + 1
        } else if (flagType === 'Text') {
            console.log('debug1')
            nextIndex = str.substring(index, str.length).match(/, [a-z\_\-]:.+/).index + index
        }
        return nextIndex === -1 ? index === str.length ? -1 : str.length : nextIndex
    }

    bot.plot.parseFlags = (flagsStr) => {
        const flagsObj = {}
        let currentIndex = 0
        let currentFlag = ''
        let nextSeperatorIndex = bot.plot.getNextSeperatorIndex(flagsStr, currentIndex)
        while (currentFlag = flagsStr.substring(currentIndex, nextSeperatorIndex)) {
            const [flagKey, flagValue] = currentFlag.split(':')
            const flagType = flagTypes[flagKey] || 'Boolean'
            const typedFlagValue = bot.plot.parseFlagValue(flagValue, flagType)

            flagsObj[flagKey] = typedFlagValue
            currentIndex = nextSeperatorIndex + FLAGS_SEPERATOR.length
            nextSeperatorIndex = bot.plot.getNextSeperatorIndex(flagsStr, currentIndex)
            if (nextSeperatorIndex === -1) break
        }
        return flagsObj
    }

    bot.plot.parseInfo = (rawPlotInfo) => {
        const plotInfo = rawPlotInfo.join('\n').match(plotInfoReg)
        if (!plotInfo) return null
        const [_, id, alias, owners, biome, helpers, trusted, denied, flags] = plotInfo
        return {
            id: id.split(';').map(e => +e),
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
        return bot.chat.getChatActionResult(`/p i ${targetId.join(';')}`, 'plotInfo', ['plotUnclaimedError'], 5000, bot.plot.events)
    }

    bot.on('message', (msg, pos) => {
        if (!bot.plot.listeningForInfo || pos !== 'system' || msg === '»' || plotInfoEndReg.test(msg)) return
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