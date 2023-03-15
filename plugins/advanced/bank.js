// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[Bank\] Kontostand: (\d+)$/, 'bankBalance')
    bot.chatAddPattern(/^\[Bank\] Du hast 2000 auf dein Bankkonto eingezahlt\.$/, 'bankDeposit')
    bot.chatAddPattern(/^\[Bank\] Du hast 2999 von deinem Bankkonto abgehoben\.$/, 'bankWithdrawl')
    bot.chatAddPattern(/^\[Bank\] Die Bank sichert dein Geld vor Verlust durch Serverfehler oder einem Reset\.$/, 'bankHelp')

    bot.chatAddPattern(/^\[Bank\] (.+) ist keine gültige Zahl\.$/, 'bankInvalidNumberError')
    bot.chatAddPattern(/^\[Bank\] Du hast nicht genug Guthaben oder willst einen zu geringen Betrag abheben\. Der Mindestein- und Auszahlungsbetrag liegt bei (.+)\$\.$/, 'bankInsufficientAmountError')
    bot.chatAddPattern(/^\[Bank\] Du kannst diesen Befehl nur alle (\d+) Sekunden benutzen\.$/, 'spamWarning')

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







