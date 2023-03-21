// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const bank = bot.ggData.bank
    bot.chat.loadPatterns(bank)

    bot.bank = {
        balance: null
    }

    bot.bank.getBalance = () => {
        return bot.chat.getChatActionResult(
            bank.commands.getBalance,
            'balance',
            [],
            5000
        )
    }

    bot.bank.deposit = (amount) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(bank.commands.deposit, amount),
            'deposit',
            ['invalidNumberError', 'insufficientAmountError'],
            5000
        )
    }

    bot.bank.withdraw = (amount) => {
        return bot.chat.getChatActionResult(
            bot.chat.buildCommand(bank.commands.withdraw, amount),
            'withdrawl',
            ['invalidNumberError', 'insufficientAmountError'],
            5000
        )
    }

    bot.on('chat:bank->balance', ([[balance]]) => {
        bot.bank.balance = +balance
    })

    bot.bank.parseBalance = (str) => +str
}







