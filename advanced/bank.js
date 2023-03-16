// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.loadChatPatterns(bot.ggData.bank)

	bot.bank = {
        balance: null
    }

    bot.bank.getBalance = () => {
        return bot.chat.getChatActionResult('/bank guthaben', 'bankBalance', [], 5000)
    }
    
    bot.bank.deposit = (amount) => {
        return bot.chat.getChatActionResult(`/bank einzahlen ${amount}`, 'bankDeposit', ['bankInvalidNumberError', 'bankInsufficientAmountError'], 5000)
    }

    bot.bank.withdraw = (amount) => {
        return bot.chat.getChatActionResult(`/bank abheben ${amount}`, 'bankWithdrawl', ['bankInvalidNumberError', 'bankInsufficientAmountError'], 5000)
    }

    bot.on('bankBalance', (balance) => {
        bot.bank.balance = +balance
    })

    bot.bank.parseBalance = (str) => +str
}







