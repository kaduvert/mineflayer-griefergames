const PLUGINS_PATH = './'

function getPlugin (name) {
    return require(PLUGINS_PATH + name)
}

const plugins = [
    getPlugin('plot'),
    getPlugin('antiAfk'),
    getPlugin('chat'),
    // getPlugin('ggauth'),
    // getPlugin('globalChat'),
    // getPlugin('home'),
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
    // getPlugin('warp')
]

module.exports = function inject(bot, options) {
    bot.loadPlugins(plugins)
    bot.cbBlocks = require('../../coords/cbblocks.json')
    bot.delay = (ms => new Promise(res => setTimeout(res, ms)))
    bot.timeStamp = () => '[' + (new Date()).toLocaleTimeString() + ']'

    const resultStatus = {
        SUCCESS: 0,
        FAILURE: 1,
        TIMEOUT: 2
    }

    bot.getActionResult = async (successEvent, failureEvents = [], timeoutLimit = 20000, successEventEmitter = bot, failureEventEmitter = bot) => {
		return new Promise((res, rej) => {
            const onSuccess = (...eventArgs) => {
                res({
                    status: resultStatus.SUCCESS,
                    triggeredEvent: successEvent,
                    eventArgs: eventArgs
                })
            }

			successEventEmitter.once(successEvent, onSuccess)

            const onFailure = (failureEvent, ...eventArgs) => {
                res({
                    status: resultStatus.FAILURE,
                    triggeredEvent: failureEvent,
                    eventArgs: eventArgs
                })
            }

            failureEvents.forEach(failureEvent => {
                failureEventEmitter.once(failureEvent, (...args) => {
                    onFailure(failureEvent, args)
                })
            })

            bot.delay(timeoutLimit).then(() => {
                successEventEmitter.off(successEvent, onSuccess)
                failureEvents.forEach(failureEvent => {
                    failureEventEmitter.off(failureEvent, onFailure)
                })
                res({
                    status: resultStatus.TIMEOUT
                })
            })
		})
	}
}