// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const bank = bot.loadPatternsAndGetData('bank')

    bot.bank = {
        balance: null
    }

    bot.on('chat:bank->balance', ([[balance]]) => {
        bot.bank.balance = +balance
    })

    bot.bank.parseBalance = (str) => +str
}







