const PLUGINS_PATH = './'

function getPlugin(name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('window'),
    getPlugin('chat'),

    getPlugin('plot'),
    getPlugin('afk'),
    getPlugin('ggauth'),
    getPlugin('globalChat'),
    getPlugin('hologram'),
    getPlugin('homes'),
    getPlugin('ignore'),
    getPlugin('item'),
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

    bot.patternHeadNameSeparator = '->' // example event name: chat:itemClear->nextIn

    bot.ActionResult = class ActionResult {
        constructor(status, event, eventArgs) {
            this.status = status
            this.event = event
            this.eventArgs = eventArgs
        }

        getWindow = () => this.event.startsWith('windowOpen') ? this.eventArgs[0] : null
        getChatPatternMatches = () => his.event.startsWith('chat:') ? this.eventArgs : null

        hasSucceeded = () => this.status === 0
        hasFailed = () => this.status === 1
        hasTimedOut = () => this.status === 2
    }
    bot.actionResultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.resolveEventPattern = (heads, identifier, emitter) => {
        if (typeof heads === 'string') {
            heads = [heads]
        }
        if (emitter !== bot || !heads?.length) return identifier

        for (const head of heads) {
            const { chatPatterns, windowPatterns } = bot.hostData[head]

            let eventOrigin = ''
            if (chatPatterns && Object.keys(chatPatterns).find(chatPatternName => chatPatternName === identifier)) {
                eventOrigin = 'chat'
            } else if (windowPatterns && Object.keys(windowPatterns).find(windowPatternName => windowPatternName === identifier)) {
                eventOrigin = 'windowOpen'
            }
            if (eventOrigin) {
                return `${eventOrigin}:${head}${bot.patternHeadNameSeparator}${identifier}`
            }
        }
        return identifier
    }

    bot.getActionResult = async (options) => {
        const {
            patternHeads = [],
            successEvents = [],
            failureEvents = [],
            patternHead,
            successEvent,
            failureEvent,
            timeout = 20 * 1000,
            successEventEmitter = bot,
            failureEventEmitter = bot
        } = options
        if (patternHead !== undefined) patternHeads.push(patternHead)
        if (successEvent !== undefined) successEvents.push(successEvent)
        if (failureEvent !== undefined) failureEvents.push(failureEvent)

        return new Promise((res, rej) => {
            bot.delay(timeout).then(() => {
                res(new bot.ActionResult(bot.actionResultStatus.TIMEOUT))
            })

            // important: add collection operator before eventArgs
            // if not using some wrapper
            const onSuccess = (successEvent, eventArgs) => {
                res(new bot.ActionResult(bot.actionResultStatus.SUCCESS, successEvent, eventArgs))
            }

            // important: add collection operator before eventArgs
            // if not using some wrapper
            const onFailure = (failureEvent, eventArgs) => {
                res(new bot.ActionResult(bot.actionResultStatus.FAILURE, failureEvent, eventArgs))
            }

            successEvents.map((eventName) => bot.resolveEventPattern(patternHeads, eventName, successEventEmitter)).forEach(successEvent => {
                const onSuccessWrapper = (...args) => {
                    onSuccess(successEvent, args)
                }
                successEventEmitter.once(successEvent, onSuccessWrapper)
                bot.delay(timeoutLimit).then(() => {
                    successEventEmitter.off(successEvent, onSuccessWrapper)
                })
            })

            failureEvents.map((eventName) => bot.resolveEventPattern(patternHeads, eventName, failureEventEmitter)).forEach(failureEvent => {
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

    bot.loadChatPatterns = (hostDataObj, patternHead = '') => {
        const chatPatterns = hostDataObj.chatPatterns
        if (!chatPatterns) return
        Object.keys(chatPatterns).forEach(chatPatternName => {
            let chatPattern = chatPatterns[chatPatternName]
            if (!(chatPattern instanceof Array)) chatPattern = [chatPattern]
            bot.addChatPatternSet(patternHead + bot.patternHeadNameSeparator + chatPatternName, chatPattern, { repeat: true, parse: true })
        })
    }


    bot.loadPatterns = (hostDataObj, patternHead) => {
        bot.loadChatPatterns(hostDataObj, patternHead)
        bot.window.loadPatterns(hostDataObj, patternHead)
    }

    bot.loadPatternsAndGetData = (hostDataObjName) => {
        const hostDataObj = bot.hostData[hostDataObjName]
        bot.loadPatterns(hostDataObj, hostDataObjName)
        return hostDataObj
    }

    bot.loadPlugins(plugins)
}
