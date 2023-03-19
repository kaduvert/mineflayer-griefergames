const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('plot'),
    getPlugin('antiAfk'),
    getPlugin('chat'),
    getPlugin('ggauth'),
    getPlugin('globalChat'),
    getPlugin('home'),
    getPlugin('itemClear'),
    getPlugin('mobRemover'),
    getPlugin('money'),
    getPlugin('mysteryMod'),
    getPlugin('near'),
    getPlugin('pathfinder'),
    getPlugin('playerUtils'),
    getPlugin('privateChat'),
    getPlugin('serverInfo'),
    getPlugin('shutdown'),
    getPlugin('switcher'),
    getPlugin('tpa'),
    getPlugin('warp')
]

module.exports = function inject(bot, options) {
    bot.loadChatPatterns = (ggDataObj) => {
        const chatPatterns = ggDataObj.chatPatterns
        Object.keys(chatPatterns).forEach(chatPatternName => {
            const chatPattern = chatPatterns[chatPatternName]
            if (chatPattern instanceof RegExp) {
                bot.addChatPattern(chatPatternName, chatPattern, { repeat: true, parse: true })
            } else if (chatPattern instanceof Array) {
                bot.addChatPatternSet(chatPatternName, chatPattern, { repeat: true, parse: true })
            }
        })
    }
    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.timeStamp = () => '[' + (new Date()).toLocaleTimeString() + ']'
    bot.parseFormattedDate = (date, time) => Date.parse(date.split('.').reverse().join('-') + 'T' + time)

    bot.actionResultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.matchesItemPattern = (stack, { titleRegex, loreRegex }) => {
        const stackName = stack.customName
        const stackLore = stack.customLore
        let isMatching = true
        if (stackName) {
            isMatching = titleRegex.test(stackName.replace(/§./g, ''))
        }
        if (stackLore) {
            for (let i = 0; i < stackLore.length; i++) {
                isMatching = loreRegex[i] ? loreRegex[i].test(stackLore.replace(/§./g, '')) : true
            }
        }
        return isMatching
    }

    bot.getItemPatternMatches = (stack, { titleRegex, loreRegex }) => {
        const matches = {
            titleMatch: null,
            loreMatches: null
        }
        if (titleRegex) {
            matches.titleMatch = stack.customName.replace(/§./g, '').match(titleRegex).splice(1)
        }
        if (loreRegex) {
            for (let i = 0; i < loreRegex.length; i++) {
                matches.loreMatches[i] = stack.customLore.replace(/§./g, '').match(loreRegex[i]).splice(1)
            }
        }
        return matches
    }

    bot.buildCommand = (blueprint, ...commandArgs) => {
        let returnCommand = blueprint
        const commandArgMatches = returnCommand.match(/\$[1-9]+/g)
        if (commandArgMatches) {
            for (commandArgMatch of commandArgMatches) {
                const commandIndex = +commandArgMatch.substring(1)
                returnCommand = returnCommand.replace(new RegExp('\\$' + commandIndex, 'g'), (commandArgs[commandIndex - 1] ?? ''))
            }
        }
        return returnCommand.trim()
    }
    
    bot.getActionResult = async (successEvents, failureEvents = [], timeoutLimit = 20000, successEventEmitter = bot, failureEventEmitter = bot) => {
        if (typeof successEvents === 'string') {
            successEvents = [ successEvents ]
        }
		return new Promise((res, rej) => {
            bot.delay(timeoutLimit).then(() => {
                res({
                    status: bot.actionResultStatus.TIMEOUT
                })
            })
            
            const onSuccess = (successEvent, ...eventArgs) => {
                res({
                    status: bot.actionResultStatus.SUCCESS,
                    triggeredEvent: successEvent,
                    eventArgs: eventArgs
                })
            }

            const onFailure = (failureEvent, ...eventArgs) => {
                res({
                    status: bot.actionResultStatus.FAILURE,
                    triggeredEvent: failureEvent,
                    eventArgs: eventArgs
                })
            }

            successEvents.forEach(successEvent => {
                const onSuccessWrapper = (...args) => {
                    onSuccess(successEvent, args)
                }
                successEventEmitter.once(successEvent, onSuccessWrapper)
                bot.delay(timeoutLimit).then(() => {
                    successEventEmitter.off(successEvent, onSuccessWrapper)
                })
            })

            failureEvents.forEach(failureEvent => {
                const onFailureWrapper = (...args) => {
                    onFailure(failureEvent, args)
                }
                failureEventEmitter.once(failureEvent, onFailureWrapper)
                bot.delay(timeoutLimit).then(() => {
                    failureEventEmitter.off(failureEvent, onFailureWrapper)
                })
            })
		})
	}
    bot.loadPlugins(plugins)
}
