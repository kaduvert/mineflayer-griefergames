// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const tpa = bot.loadPatternsAndGetData('tpa')

    bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.sendFallible({
            patternHead: 'tpa',
            command: ['request', username],
            successEvent: 'sent',
            failureEvents: ['toggledError', 'disallowedError'],
            timeout: 7500
        })
    }

    bot.tpa.requestHere = (username) => {
        return bot.chat.sendFallible({
            patternHead: 'tpa',
            command: ['requestHere', username],
            successEvent: 'sent',
            failureEvents: ['toggledError', 'disallowedError'],
            timeout: 7500
        })
    }

    bot.tpa.accept = () => {
        return bot.chat.sendFallible({
            patternHead: 'tpa',
            command: 'accept',
            successEvent: 'accepted',
            failureEvents: ['disallowedError', 'notFoundError', 'expiredError'],
            timeout: 7500
        })
    }

    bot.tpa.deny = () => {
        return bot.chat.sendFallible({
            patternHead: 'tpa',
            command: 'deny',
            successEvent: 'denied',
            failureEvents: ['notFoundError', 'nullError'],
            timeout: 7500
        })
    }

    bot.tpa.toggle = () => {
        return bot.chat.sendFallible({
            patternHead: 'tpa',
            command: 'toggle',
            successEvents: ['activated', 'deactivated'],
            failureEvents: ['notFoundError', 'nullError'],
            timeout: 7500
        })
    }
}
