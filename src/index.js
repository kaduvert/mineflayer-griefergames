const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    require('mineflayer-extra-patterns'),
    getPlugin('patternShortcuts'),
    getPlugin('chat'),
    getPlugin('window'),
    getPlugin('griefergames-data'),
    getPlugin('basic'),
    getPlugin('advanced'),
]

module.exports = function inject (bot, options) {
    bot.gg = {}
    const ns = bot.gg

    ns.data = require('mineflayer-griefergames-data')

    Object.keys(ns.data).forEach(dataObjName => {
        ns[dataObjName] = {}
    })

    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.parseFormattedDate = (date, time) => Date.parse(date.split('.').reverse().join('-') + 'T' + time)

    bot.buildString = (blueprint, args) => {
        let str = blueprint
        const matches = str.match(/\$[1-9]+/g)
        if (matches) {
            for (match of matches) {
                const index = +match.substring(1)
                str = str.replace(new RegExp('\\$' + index, 'g'), (args[index - 1] ?? ''))
            }
        }
        return str// .trim()
    }

    bot.patternHeadNameSeparator = '->' // example event name: chat:itemClear->nextIn

    bot.ActionResult = class ActionResult {
        constructor(status, event, eventArgs) {
            this.status = status
            this.event = event
            this.eventArgs = eventArgs
        }

        getWindow = () => this.event.startsWith('windowOpen') ? this.eventArgs[0] : null
        getChatPatternMatches = () => this.event.startsWith('chat:') ? this.eventArgs : null

        hasSucceeded = () => this.status === 0
        hasFailed = () => this.status === 1
        hasTimedOut = () => this.status === 2
    }
    bot.actionResultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.getActionResult = async (options) => {
        const {
            patternHeads = [],
            successEvents = [],
            failureEvents = [],
            patternHead,
            successEvent,
            failureEvent,
            emitter = bot,
            timeout = 5 * 1000
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

            successEvents.map((eventName) => (emitter === bot ? bot.getMultiHeadEventIdentifier(patternHeads, eventName) : successEvents)).forEach(successEvent => {
                const onSuccessWrapper = (...args) => {
                    onSuccess(successEvent, args)
                }
                emitter.once(successEvent, onSuccessWrapper)
                bot.delay(timeout).then(() => {
                    emitter.off(successEvent, onSuccessWrapper)
                })
            })

            failureEvents.map((eventName) => (emitter === bot ? bot.getMultiHeadEventIdentifier(patternHeads, eventName) : successEvents)).forEach(failureEvent => {
                const onFailureWrapper = (...args) => {
                    onFailure(failureEvent, args)
                }
                emitter.once(failureEvent, onFailureWrapper)
                bot.delay(timeout).then(() => {
                    emitter.off(failureEvent, onFailureWrapper)
                })
            })
        })
    }

    bot.loadChatPatterns = (chatPatterns, patternHead = '') => {
        if (!chatPatterns) return
        Object.keys(chatPatterns).forEach(chatPatternName => {
            let chatPattern = chatPatterns[chatPatternName]
            if (!(chatPattern instanceof Array)) chatPattern = [chatPattern]
            bot.addChatPatternSet(patternHead + bot.patternHeadNameSeparator + chatPatternName, chatPattern, { repeat: true, parse: true })
        })
    }

    ns.getPlayerInfo = (username) => {
        const player = bot.players[username]

        return {
            uuid: player.uuid,
            username: player.username,
            rank: ns.playerUtils.getRank(player.username),
            prefix: ns.prefix.get(player.username)
        }
    }

    plugins.forEach(plugin => {
        plugin(bot, ns)
    })
}
