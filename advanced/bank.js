// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const bank = bot.ggData.bank
    bot.loadChatPatterns(bank)

	bot.bank = {
        balance: null
    }

    bot.bank.getBalance = () => {
        return bot.chat.getChatActionResult(bank.getBalance(), 'chat:bankBalance', [], 5000)
    }
    
    bot.bank.deposit = (amount) => {
        return bot.chat.getChatActionResult(bank.deposit(amount), 'chat:bankDeposit', ['chat:bankInvalidNumberError', 'chat:bankInsufficientAmountError'], 5000)
    }

    bot.bank.withdraw = (amount) => {
        return bot.chat.getChatActionResult(bank.withdraw(amount), 'chat:bankWithdrawl', ['chat:bankInvalidNumberError', 'chat:bankInsufficientAmountError'], 5000)
    }

    bot.on('chat:bankBalance', ([[ balance ]]) => {
        bot.bank.balance = +balance
    })

    bot.bank.parseBalance = (str) => +str
}







