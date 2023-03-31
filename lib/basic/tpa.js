// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const tpa = bot.loadPatternsAndGetData('tpa')

    bot.tpa = {
        // events: new EventEmitter()
    }

    bot.tpa.request = (username) => {
        return bot.chat.sendFallibe(
            'tpa',
            ['request', username],
            'sent',
            ['toggledError', 'disallowedError'],
            7500
        )
    }

    bot.tpa.requestHere = (username) => {
        return bot.chat.sendFallibe(
            'tpa',
            ['requestHere', username],
            'sent',
            ['toggledError', 'disallowedError'],
            7500
        )
    }

    bot.tpa.accept = () => {
        return bot.chat.sendFallibe(
            'tpa',
            'accept',
            'accepted',
            ['disallowedError', 'notFoundError', 'expiredError'],
            7500
        )
    }

    bot.tpa.deny = () => {
        return bot.chat.sendFallibe(
            'tpa',
            'deny',
            'denied',
            ['notFoundError', 'nullError'],
            7500
        )
    }

    bot.tpa.toggle = () => {
        return bot.chat.sendFallibe(
            'tpa',
            'toggle',
            ['activated', 'deactivated'],
            ['notFoundError', 'nullError'],
            7500
        )
    }
}
