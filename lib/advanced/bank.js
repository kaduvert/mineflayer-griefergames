// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const bank = bot.loadPatternsAndGetData('bank')

    bot.bank = {
        balance: null
    }

    bot.bank.getBalance = () => {
        return bot.chat.sendFallible({
            patternHead: 'bank',
            command: 'getBalance',
            successEvent: 'balance',
            timeout: 5000
        })
    }

    bot.bank.deposit = (amount) => {
        return bot.chat.sendFallible({
            patternHead: 'bank',
            command: ['deposit', amount],
            successEvent: 'depositSuccess',
            failureEvents: ['invalidNumberError', 'insufficientAmountError'],
            timeout: 5000
        })
    }

    bot.bank.withdraw = (amount) => {
        return bot.chat.sendFallible({
            patternHead: 'bank',
            command: ['withdraw', amount],
            successEvent: 'withdrawSuccess',
            failureEvents: ['invalidNumberError', 'insufficientAmountError'],
            timeout: 5000
        })
    }

    bot.on('chat:bank->balance', ([[balance]]) => {
        bot.bank.balance = +balance
    })

    bot.bank.parseBalance = (str) => +str
}







