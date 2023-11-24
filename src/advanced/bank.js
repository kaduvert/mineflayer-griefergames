module.exports = function load(bot, ns) {
    const bank = ns.data['bank']

    ns.bank.balance = null

    bot.on('chat:bank->balance', ([[balance]]) => {
        ns.bank.balance = +balance
    })

    ns.bank.parseBalance = (str) => +str
}
