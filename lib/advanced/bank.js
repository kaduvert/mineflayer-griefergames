// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const bank = bot.loadPatternsAndGetData('bank')

    bot.bank = {
        balance: null
    }

    bot.bank.getBalance = () => {
        return bot.chat.sendFallibe(
            'bank',
            'getBalance',
            'balance',
            [],
            5000
        )
    }

    bot.bank.deposit = (amount) => {
        return bot.chat.sendFallibe(
            'bank',
            ['deposit', amount],
            'depositSuccess',
            ['invalidNumberError', 'insufficientAmountError'],
            5000
        )
    }

    bot.bank.withdraw = (amount) => {
        return bot.chat.sendFallibe(
            'bank',
            ['withdraw', amount],
            'withdrawSuccess',
            ['invalidNumberError', 'insufficientAmountError'],
            5000
        )
    }

    bot.on('chat:bank->balance', ([[balance]]) => {
        bot.bank.balance = +balance
    })

    bot.bank.parseBalance = (str) => +str
}







