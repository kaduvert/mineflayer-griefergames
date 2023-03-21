const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('plot'),
    getPlugin('afk'),
    getPlugin('ggauth'),
    getPlugin('globalChat'),
    getPlugin('homes'),
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
    getPlugin('switch'),
    getPlugin('tpa'),
    getPlugin('warp')
]

module.exports = function inject(bot, options) {
    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.timeStamp = () => '[' + (new Date()).toLocaleTimeString() + ']'
    bot.parseFormattedDate = (date, time) => Date.parse(date.split('.').reverse().join('-') + 'T' + time)

    bot.actionResultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.resolveEvent = (patternResolver, patternName, eventEmitter) => {
        if (eventEmitter !== bot || !patternResolver) return patternName

        const { chatPatterns, windowPatterns } = bot.ggData[patternResolver]

        let eventOrigin = ''
        if (chatPatterns && Object.keys(chatPatterns).find(chatPatternName => chatPatternName === patternName)) {
            eventOrigin = 'chat'
        } else if (windowPatterns && Object.keys(windowPatterns).find(windowPatternName => windowPatternName === patternName)) {
            eventOrigin = 'windowOpen'
        }
        return eventOrigin ? `${eventOrigin}:${patternResolver}${bot.patternHeadNameSeparator}${patternName}` : patternName
    }

    bot.resolveItemPattern = (patternResolver, patternName) => bot.ggData[patternResolver].itemPatterns[patternName]

    bot.getActionResult = async (patternResolver, successEvents, failureEvents = [], timeoutLimit = 20000, successEventEmitter = bot, failureEventEmitter = bot) => {
        if (typeof successEvents === 'string') {
            successEvents = [successEvents]
        }
        return new Promise((res, rej) => {
            bot.delay(timeoutLimit).then(() => {
                res({
                    status: bot.actionResultStatus.TIMEOUT
                })
            })

            // important: add collection operator before eventArgs
            // if not using some wrapper
            const onSuccess = (successEvent, eventArgs) => {
                res({
                    status: bot.actionResultStatus.SUCCESS,
                    event: successEvent,
                    eventArgs: eventArgs
                })
            }

            // important: add collection operator before eventArgs
            // if not using some wrapper
            const onFailure = (failureEvent, eventArgs) => {
                res({
                    status: bot.actionResultStatus.FAILURE,
                    event: failureEvent,
                    eventArgs: eventArgs
                })
            }

            successEvents.map((eventName) => bot.resolveEvent(patternResolver, eventName, successEventEmitter)).forEach(successEvent => {
                const onSuccessWrapper = (...args) => {
                    onSuccess(successEvent, args)
                }
                successEventEmitter.once(successEvent, onSuccessWrapper)
                bot.delay(timeoutLimit).then(() => {
                    successEventEmitter.off(successEvent, onSuccessWrapper)
                })
            })

            failureEvents.map((eventName) => bot.resolveEvent(patternResolver, eventName, failureEventEmitter)).forEach(failureEvent => {
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

    bot.loadChatPatterns = (ggDataObj, patternHead = '') => {
		const chatPatterns = ggDataObj.chatPatterns
		if (!chatPatterns) return
		Object.keys(chatPatterns).forEach(chatPatternName => {
			let chatPattern = chatPatterns[chatPatternName]
			if (!(chatPattern instanceof Array)) chatPattern = [chatPattern]
			bot.addChatPatternSet(patternHead + bot.ggData.patternHeadNameSeparator + chatPatternName, chatPattern, { repeat: true, parse: true })
		})
	}

    bot.loadWindowPatterns = (ggDataObj, patternHead) => {
        const windowPatterns = ggDataObj.windowPatterns
        if (!windowPatterns) return
        Object.keys(windowPatterns).forEach(windowPatternName => {
            bot.window.patterns[patternHead + bot.ggData.patternHeadNameSeparator + windowPatternName] = windowPatterns[windowPatternName]
        })
    }

    bot.loadPatterns = (ggDataObj, patternHead) => {
        bot.loadChatPatterns(ggDataObj, patternHead)
        bot.loadWindowPatterns(ggDataObj, patternHead)
    }

    bot.loadPatternsAndGetData = (ggDataObjName) => {
        const ggDataObj = bot.ggData[ggDataObjName]
        bot.loadPatterns(ggDataObj, ggDataObjName)
        return ggDataObj
    }

    bot.loadPlugins(plugins)
}
